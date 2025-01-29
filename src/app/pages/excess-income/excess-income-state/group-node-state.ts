import {
	ExcessIncomeFromBackendGroup,
	ExcessIncomeGroup,
	ExcessIncomeParamsFormGroup,
} from '@app/core/models/excess-income/excess-income-from-backend-group';
import { BehaviorSubject, debounceTime, map, NEVER, Observable, scan, switchMap, tap } from 'rxjs';
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
import { signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@UntilDestroy()
export class GroupNodeState extends ExcessIncomeBaseNodeState {
	public groupSignal: WritableSignal<ExcessIncomeGroup> = signal(
		this.createFormGroup(this.group),
	);

	public formGroup: FormGroup<ExcessIncomeParamsFormGroup> = this.groupSignal().paramsGroup;

	readonly event$: BehaviorSubject<ExcessIncomeGroupEventEnum> =
		new BehaviorSubject<ExcessIncomeGroupEventEnum>(
			ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault,
		);

	get canEdit(): boolean {
		return !this.permissions.includes(Permissions.EXCESS_INCOME_EDIT);
	}

	get getSndNextControl() {
		return this.formGroup.controls.sndNextControl;
	}

	get getSndCurrentControl() {
		return this.formGroup.controls.sndCurrentControl;
	}

	public validSndControlCurrent$: Observable<boolean> =
		this.getSndCurrentControl.statusChanges.pipe(
			map(status => {
				return status === 'VALID';
			}),
		);

	public validSndControlNext$: Observable<boolean> = this.getSndNextControl.statusChanges.pipe(
		map(status => {
			return status === 'VALID';
		}),
	);

	public tov$: BehaviorSubject<TovNodeState[]> = new BehaviorSubject<TovNodeState[]>([]);

	private createFormGroup(item: ExcessIncomeFromBackendGroup): ExcessIncomeGroup {
		this.formGroup = new FormBuilder().group({
			sndCurrentControl: [
				item.currentExcessIncomePercent,
				compareValues(item.currentExcessIncomePercent),
			],
			sndNextControl: [
				item.nextExcessIncomePercent,
				compareValues(item.nextExcessIncomePercent),
			],
		});

		return this.mapExcessIncomeGroup(item, this.formGroup);
	}

	private mapExcessIncomeGroup(
		item: ExcessIncomeFromBackendGroup,
		formGroup: FormGroup<ExcessIncomeParamsFormGroup>,
	): ExcessIncomeGroup {
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
		private readonly contractorId: number | null,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		super();

		if (this.canEdit) {
			this.getSndNextControl.disable();
			this.getSndCurrentControl.disable();
		}

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
				tap(event => {
					this.isLoader$.next(true);
					if (
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate ||
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency
					) {
						this.tov$.next([]);
					}
				}),
				debounceTime(2000),
				untilDestroyed(this),
				switchMap(event => {
					if (event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault) {
						return NEVER;
					}

					if (!this.expended$.value) {
						this.paginationControl.setValue(0, { emitEvent: false });
						return NEVER;
					}

					if (
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate ||
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency
					) {
						this.paginationControl.setValue(0, { emitEvent: false });
					}

					return this.getTov(clientId, this.contractorId);
				}),
				map(res => {
					this.total$.next(res.data.total);
					return res.data.items.map(item => {
						return new TovNodeState(
							item,
							res.permissions,
							service,
							this.contractorId,
							state,
							this.state.currencyControl.value!,
							this,
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

	updateFormState(group: ExcessIncomeFromBackendGroup) {
		this.formGroup.controls.sndNextControl.setValue(group.nextExcessIncomePercent);
		this.formGroup.controls.sndNextControl.setValidators(
			compareValues(group.nextExcessIncomePercent),
		);
		this.formGroup.controls.sndCurrentControl.setValue(group.currentExcessIncomePercent);
		this.formGroup.controls.sndCurrentControl.setValidators(
			compareValues(group.currentExcessIncomePercent),
		);
		this.formGroup.controls.sndNextControl.updateValueAndValidity();
		this.formGroup.controls.sndCurrentControl.updateValueAndValidity();
	}

	updateSnd($event: MouseEvent, isCurrent: boolean) {
		$event.stopPropagation();
		$event.preventDefault();
		let excessIncomePercent: number | null = null;

		isCurrent
			? (excessIncomePercent = this.getSndCurrentControl.value)
			: (excessIncomePercent = this.getSndNextControl.value);

		this.update(isCurrent, excessIncomePercent);
	}

	public update(isCurrent: boolean, excessIncomePercent: number | null) {
		this.service
			.updateSndTovGroups(this.groupSignal().client.id, {
				contractorId: this.contractorId,
				tovGroupId: this.groupSignal().tovSubgroup.id,
				isCurrent: isCurrent,
				excessIncomePercent: excessIncomePercent,
			})
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				this.updateFormState(item);
				this.groupSignal.set(this.mapExcessIncomeGroup(item, this.formGroup));
				this.event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate);
			});
	}

	private getTov(clientId: number, contractorId: number | null) {
		return this.service.getTov({
			limit: this.limit,
			offset: this.paginationControl.value!,
			clientId: clientId,
			contractorId: contractorId,
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
