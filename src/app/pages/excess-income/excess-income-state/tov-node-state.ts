import {
	ExcessIncomeParamsFormGroup,
	ExcessIncomeTov,
	ExcessIncomeTovFromBackend,
	ParamTov,
} from '@app/core/models/excess-income/excess-income-tov-from-backend';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ExcessIncomeBaseNodeState } from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';
import { signal, WritableSignal } from '@angular/core';
import { map, Subscription, tap } from 'rxjs';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { Permissions } from '@app/core/constants/permissions.constants';

@UntilDestroy()
export class TovNodeState extends ExcessIncomeBaseNodeState {
	public tovSignal: WritableSignal<ExcessIncomeTov> = signal(this.mapExcessIncomeTov(this.tov));
	public currencySignal: WritableSignal<IDictionaryItemDto> = signal(this.currency);
	public state: ExcessIncomeState;

	public currentParams = this.tovSignal().params.controls.currentParams;

	public nextParams = this.tovSignal().params.controls.nextParams;

	public subscription: Subscription = new Subscription();

	get canEditSnd(): boolean {
		return !this.permissions.includes(Permissions.EXCESS_INCOME_EDIT);
	}

	get canEditComment(): boolean {
		return !this.permissions.includes(Permissions.EXCESS_INCOME_EDIT_COMMENT);
	}

	constructor(
		private readonly tov: ExcessIncomeTovFromBackend,
		private readonly permissions: string[],
		private readonly service: ExcessIncomeService,
		state: ExcessIncomeState,
		private readonly currency: IDictionaryItemDto,
	) {
		super();

		this.state = state;

		this.updateFromState();
		if (this.canEditSnd) {
			this.currentParams.disable();
			this.nextParams.disable();
		}
	}

	updateFromState() {
		this.subscription.add(
			this.currentParams.valueChanges
				.pipe(
					tap(val => {
						this.getFinalPrice(val, this.currentParams);
					}),
				)
				.subscribe(),
		);

		this.subscription.add(
			this.nextParams.valueChanges
				.pipe(
					tap(val => {
						this.getFinalPrice(val, this.nextParams);
					}),
				)
				.subscribe(),
		);

		this.subscription.add(
			this.currentParams.controls.excessIncomePercent.valueChanges
				.pipe(
					tap(value => {
						console.log(value, this.currentParams.controls.excessIncomePercent);
						this.currentParams.controls.fixPrice.setValue(null, { emitEvent: false });
					}),
				)
				.subscribe(),
		);

		this.subscription.add(
			this.currentParams.controls.fixPrice.valueChanges
				.pipe(
					tap(value => {
						this.currentParams.controls.excessIncomePercent.setValue(null, {
							emitEvent: false,
						});
					}),
				)
				.subscribe(),
		);

		this.subscription.add(
			this.nextParams.controls.excessIncomePercent.valueChanges
				.pipe(
					tap(value => {
						this.nextParams.controls.fixPrice.setValue(null, {
							emitEvent: false,
						});
					}),
				)
				.subscribe(),
		);

		this.subscription.add(
			this.nextParams.controls.fixPrice.valueChanges
				.pipe(
					tap(value => {
						this.nextParams.controls.excessIncomePercent.setValue(null, {
							emitEvent: false,
						});
					}),
				)
				.subscribe(),
		);
	}

	public getFinalPrice(partial: Partial<ParamTov>, formGroup: FormGroup): void {
		if (partial.price) {
			if (partial.fixPrice) {
				formGroup.controls.finalPrice.setValue(partial.fixPrice, {
					emitEvent: false,
				});
			} else if (partial.excessIncomePercent) {
				formGroup.controls.finalPrice.setValue(
					this.calculateFinalPrice(partial.price, partial.excessIncomePercent),
					{ emitEvent: false },
				);
			}
		}
	}

	private calculateFinalPrice(price: number, snd: number): number {
		return price + (snd / 100) * price;
	}

	public updateTov() {
		this.service
			.updateSndTov({
				clientId: this.tov.client.id,
				contractorId: this.tov.contractor.id,
				tovGroupId: this.tov.tovSubgroup.id,
				tovId: this.tov.tov.id,
				currencyId: this.currencySignal().id,
				currentExcessIncomePercent: this.currentParams.controls.excessIncomePercent.value,
				currentFixPrice: this.currentParams.controls.fixPrice.value,
				nextExcessIncomePercent: this.nextParams.controls.excessIncomePercent.value,
				nextFixPrice: this.nextParams.controls.fixPrice.value,
			})
			.pipe(
				untilDestroyed(this),
				map(items => this.mapExcessIncomeTov(items)),
			)
			.subscribe(value => {
				this.tovSignal.set(value);
				this.currentParams = this.tovSignal().params.controls.currentParams;
				this.nextParams = this.tovSignal().params.controls.nextParams;
				this.updateFromState();
			});
	}

	public updateComment() {
		this.service
			.updateSndTovComment({
				clientId: this.tov.client.id,
				contractorId: this.tov.contractor.id,
				tovId: this.tov.tov.id,
				comment: this.tovSignal().comment.value,
			})
			.pipe(
				untilDestroyed(this),
				map(items => this.mapExcessIncomeTov(items)),
			)

			.subscribe(value => {
				this.tovSignal.set(value);
				this.currentParams = this.tovSignal().params.controls.currentParams;
				this.nextParams = this.tovSignal().params.controls.nextParams;
				this.updateFromState();
			});
	}

	private mapExcessIncomeTov(item: ExcessIncomeTovFromBackend): ExcessIncomeTov {
		const formGroup: FormGroup<ExcessIncomeParamsFormGroup> = new FormBuilder().group({
			currentParams: new FormBuilder().group({
				price: [item.currentParams.price],
				excessIncomePercent: [
					item.currentParams.excessIncomePercent,
					compareValues(item.currentParams.excessIncomePercent),
				],
				fixPrice: [item.currentParams.fixPrice, compareValues(item.currentParams.fixPrice)],
				finalPrice: [item.currentParams.finalPrice],
			}),
			nextParams: new FormBuilder().group({
				price: [item.nextParams.price],
				excessIncomePercent: [
					item.nextParams.excessIncomePercent,
					compareValues(item.nextParams.excessIncomePercent),
				],
				fixPrice: [item.nextParams.fixPrice, compareValues(item.nextParams.fixPrice)],
				finalPrice: [item.nextParams.finalPrice],
			}),
		});

		const comment = new FormControl<string | null>(null);
		return {
			id: item.id,
			tov: item.tov,
			client: item.client,
			contractor: item.contractor,
			category: item.category,
			tovSubgroup: item.tovSubgroup,
			status: item.status,
			params: formGroup,
			comment,
		};
	}
}

export function compareValues(oldValue: number | null): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const newValue = control.value;

		return newValue !== oldValue ? null : { valuesDoNotMatch: true };
	};
}
