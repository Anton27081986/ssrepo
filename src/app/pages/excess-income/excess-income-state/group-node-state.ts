import {
	ExcessIncomeFromBackendGroup,
	ExcessIncomeGroup,
	ExcessIncomeParamsFormGroup,
	IdName,
} from '@app/core/models/excess-income/excess-income-from-backend-group';
import { BehaviorSubject, debounceTime, map, NEVER, scan, switchMap, tap } from 'rxjs';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeGroupEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import {
	compareValues,
	ExcessIncomeBaseNodeState,
} from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';
import { Permissions } from '@app/core/constants/permissions.constants';
import { effect, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@UntilDestroy()
export class GroupNodeState extends ExcessIncomeBaseNodeState {
	public groupSignal: WritableSignal<ExcessIncomeGroup> = signal(
		this.mapExcessIncomeGroup(this.group),
	);

	readonly event$: BehaviorSubject<ExcessIncomeGroupEventEnum> =
		new BehaviorSubject<ExcessIncomeGroupEventEnum>(
			ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault,
		);

	get canEdit(): boolean {
		return !this.permissions.includes(Permissions.EXCESS_INCOME_EDIT);
	}

	get getSndNextControl() {
		return this.groupSignal().paramsGroup.controls.sndNextControl;
	}

	get getSndCurrentControl() {
		return this.groupSignal().paramsGroup.controls.sndCurrentControl;
	}

	public tov$: BehaviorSubject<TovNodeState[]> = new BehaviorSubject<TovNodeState[]>([]);

	private mapExcessIncomeGroup(item: ExcessIncomeFromBackendGroup): ExcessIncomeGroup {
		const formGroup: FormGroup<ExcessIncomeParamsFormGroup> = new FormBuilder().group({
			sndCurrentControl: [
				item.currentExcessIncomePercent,
				compareValues(item.currentExcessIncomePercent),
			],
			sndNextControl: [
				item.nextExcessIncomePercent,
				compareValues(item.nextExcessIncomePercent),
			],
		});

		return {
			client: item.client,
			contractor: item.contractor,
			category: item.category,
			tovSubgroup: item.tovSubgroup,
			currentExcessIncomePercent: item.currentExcessIncomePercent,
			nextExcessIncomePercent: item.nextExcessIncomePercent,
			paramsGroup: formGroup,
		};
	}

	constructor(
		private readonly group: ExcessIncomeFromBackendGroup,
		private readonly permissions: string[],
		clientId: number,
		contractorId: number | null,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		super();

		this.state.currencyControl.valueChanges.pipe(filterTruthy()).subscribe(value => {
			this.event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency);
		});

		this.paginationControl.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (val) {
						this.event$.next(
							ExcessIncomeGroupEventEnum.excessIncomeGroupEventChangeOffset,
						);
					}
				}),
			)
			.subscribe();
		this.expended$
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (val) {
						this.event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupEventExpended);
					}
				}),
			)
			.subscribe();

		this.event$
			.pipe(
				tap(() => this.isLoader$.next(true)),
				debounceTime(2000),
				untilDestroyed(this),
				switchMap(event => {
					if (event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault) {
						return NEVER;
					}

					if (
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate ||
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency
					) {
						if (!this.expended$.value) {
							return NEVER;
						}

						this.paginationControl.setValue(0, { emitEvent: false });
					}

					return this.getTov(clientId, contractorId);
				}),
				map(res => {
					this.total$.next(res.data.total);

					return res.data.items.map(item => {
						return new TovNodeState(
							item,
							res.permissions,
							service,
							state,
							this.state.currencyControl.value!,
						);
					});
				}),
				scan((acc, value) => {
					if (
						this.event$.value ===
						ExcessIncomeGroupEventEnum.excessIncomeGroupEventChangeOffset
					) {
						return [...acc, ...value];
					}

					return value;
				}),
			)
			.subscribe(items => {
				this.tov$.next(items);
				this.isLoader$.next(false);
			});
	}

	public updateSnd($event: MouseEvent) {
		$event.stopPropagation();
		$event.preventDefault();

		this.service
			.updateSndTovGroups(this.groupSignal().client.id, {
				contractorId: this.groupSignal().contractor.id,
				tovGroupId: this.groupSignal().tovSubgroup.id,
				currentExcessIncomePercent: this.getSndCurrentControl.value,
				nextExcessIncomePercent: this.getSndNextControl.value,
			})
			.pipe(
				untilDestroyed(this),
				map(item => {
					return this.mapExcessIncomeGroup(item);
				}),
			)
			.subscribe(item => {
				this.groupSignal.set(item);
			});
	}

	private getTov(clientId: number, contractorId: number | null) {
		return this.service.getTov({
			limit: 10,
			offset: this.paginationControl.value!,
			clientId,
			contractorId,
			tovSubGroupId: this.group.tovSubgroup.id,
			currencyId: this.state.currencyControl.value?.id!,
			tovsIds: this.state.filters$.value.tov,
		});
	}

	focusOutControl($event: FocusEvent) {
		const relatedTarget = $event.relatedTarget as HTMLElement;

		if (
			relatedTarget &&
			$event.currentTarget &&
			($event.currentTarget as HTMLElement).contains(relatedTarget)
		) {
			return;
		}

		this.getSndNextControl.setValue(this.groupSignal().nextExcessIncomePercent);
		this.getSndCurrentControl.setValue(this.groupSignal().currentExcessIncomePercent);
	}
}
