import {
	ExcessIncomeParamsFormTov,
	ExcessIncomeTov,
	ExcessIncomeTovFromBackend,
	ParamTov,
} from '@app/core/models/excess-income/excess-income-tov-from-backend';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	compareValues,
	ExcessIncomeBaseNodeState,
} from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';
import { signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Permissions } from '@app/core/constants/permissions.constants';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';

@UntilDestroy()
export class TovNodeState extends ExcessIncomeBaseNodeState {
	public blockValueChangeForm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public tovSignal: WritableSignal<ExcessIncomeTov> = signal(this.createFormGroup(this.tov));
	public currencySignal: WritableSignal<IDictionaryItemDto> = signal(this.currency);
	public tovCommentSignal: WritableSignal<string | null> = signal(this.tov.comment);
	public state: ExcessIncomeState;

	public formGroup: FormGroup<ExcessIncomeParamsFormTov> = this.tovSignal().paramsGroup;

	public currentParams = this.tovSignal().paramsGroup.controls.currentParams;

	public nextParams = this.tovSignal().paramsGroup.controls.nextParams;

	public subscription: Subscription = new Subscription();

	public tovSubject$: BehaviorSubject<ExcessIncomeTovFromBackend> =
		new BehaviorSubject<ExcessIncomeTovFromBackend>(this.tov);

	get canEditSnd(): boolean {
		return !this.permissions.includes(Permissions.EXCESS_INCOME_EDIT);
	}

	get canEditComment(): boolean {
		return this.permissions.includes(Permissions.EXCESS_INCOME_EDIT_COMMENT);
	}

	public validSndControlCurrent$: Observable<boolean> =
		this.currentParams.controls.excessIncomePercent.statusChanges.pipe(
			map(status => {
				return status === 'VALID';
			}),
		);

	public validSndControlNext$: Observable<boolean> =
		this.nextParams.controls.excessIncomePercent.statusChanges.pipe(
			map(status => {
				return status === 'VALID';
			}),
		);

	public validFixPriceControlCurrent$: Observable<boolean> =
		this.currentParams.controls.fixPrice.statusChanges.pipe(
			map(status => {
				return status === 'VALID';
			}),
		);

	public validFixPriceControlNext$: Observable<boolean> =
		this.nextParams.controls.fixPrice.statusChanges.pipe(
			map(status => {
				return status === 'VALID';
			}),
		);

	constructor(
		private readonly tov: ExcessIncomeTovFromBackend,
		private readonly permissions: string[],
		private readonly service: ExcessIncomeService,
		private readonly contractorId: number | null,
		state: ExcessIncomeState,
		private readonly currency: IDictionaryItemDto,
		private readonly groupNodeState: GroupNodeState,
	) {
		super();

		this.state = state;

		this.currentParams.controls.excessIncomePercent.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(control => {
					if (this.blockValueChangeForm$.value || this.canEditSnd) {
						return;
					}
					if (this.currentParams.controls.price.value && control) {
						this.currentParams.controls.finalPrice.setValue(
							this.calculateFinalPrice(
								this.currentParams.controls.price.value,
								control,
							),
						);
					} else {
						this.currentParams.controls.finalPrice.setValue(0);
					}
				}),
			)
			.subscribe();

		this.currentParams.controls.fixPrice.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(control => {
					if (this.blockValueChangeForm$.value || this.canEditSnd) {
						return;
					}
					this.currentParams.controls.finalPrice.setValue(control);
				}),
			)
			.subscribe();

		this.nextParams.controls.excessIncomePercent.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (this.blockValueChangeForm$.value || this.canEditSnd) {
						return;
					}
					if (this.nextParams.controls.price.value && val) {
						this.nextParams.controls.finalPrice.setValue(
							this.calculateFinalPrice(this.nextParams.controls.price.value, val),
						);
					} else {
						this.nextParams.controls.finalPrice.setValue(0);
					}
				}),
			)
			.subscribe();

		this.nextParams.controls.fixPrice.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (this.blockValueChangeForm$.value || this.canEditSnd) {
						return;
					}
					this.nextParams.controls.finalPrice.setValue(val);
				}),
			)
			.subscribe();
	}

	public updateFromState(tov: ExcessIncomeTovFromBackend) {
		this.currentParams.controls.price.setValue(tov.currentParams.price, { emitEvent: false });

		this.currentParams.controls.excessIncomePercent.setValue(
			tov.currentParams.excessIncomePercent,
			{ emitEvent: false },
		);

		this.currentParams.controls.fixPrice.setValue(tov.currentParams.fixPrice, {
			emitEvent: false,
		});

		this.currentParams.controls.finalPrice.setValue(tov.currentParams.finalPrice, {
			emitEvent: false,
		});

		this.currentParams.controls.fixPriceCurrency.setValue(tov.currentParams.fixPriceCurrency, {
			emitEvent: false,
		});

		this.currentParams.controls.excessIncomePercent.setValidators(
			compareValues(tov.currentParams.excessIncomePercent),
		);
		this.currentParams.controls.excessIncomePercent.updateValueAndValidity();

		this.currentParams.controls.fixPrice.setValidators(
			compareValues(tov.currentParams.fixPrice),
		);
		this.currentParams.controls.fixPrice.updateValueAndValidity();

		this.nextParams.controls.price.setValue(tov.nextParams.price, { emitEvent: false });
		this.nextParams.controls.excessIncomePercent.setValue(tov.nextParams.excessIncomePercent, {
			emitEvent: false,
		});
		this.nextParams.controls.fixPrice.setValue(tov.nextParams.fixPrice, { emitEvent: false });
		this.nextParams.controls.finalPrice.setValue(tov.nextParams.finalPrice, {
			emitEvent: false,
		});

		this.nextParams.controls.excessIncomePercent.setValidators(
			compareValues(tov.nextParams.excessIncomePercent),
		);

		this.nextParams.controls.fixPriceCurrency.setValue(tov.nextParams.fixPriceCurrency, {
			emitEvent: false,
		});

		this.nextParams.controls.excessIncomePercent.updateValueAndValidity();
		this.nextParams.controls.fixPrice.setValidators(compareValues(tov.nextParams.fixPrice));
		this.nextParams.controls.fixPrice.updateValueAndValidity();
	}

	private calculateFinalPrice(price: number, snd: number): number {
		return price + (snd / 100) * price;
	}

	public updateSnd(isCurrent: boolean) {
		let excessIncomePercentValue;
		if (isCurrent) {
			this.resetSndCurrentParent();
			excessIncomePercentValue = this.currentParams.controls.excessIncomePercent.value;
		} else {
			this.resetSndNextParent();
			excessIncomePercentValue = this.nextParams.controls.excessIncomePercent.value;
		}
		this.updateTov(isCurrent, excessIncomePercentValue, null);
	}

	resetSndCurrentParent() {
		this.groupNodeState.getSndCurrentControl.setValue(null);
		this.groupNodeState.getSndCurrentControl.setValidators(compareValues(null));
		this.groupNodeState.getSndCurrentControl.updateValueAndValidity();
	}

	resetSndNextParent() {
		this.groupNodeState.getSndNextControl.setValue(null);
		this.groupNodeState.getSndNextControl.setValidators(compareValues(null));
		this.groupNodeState.getSndNextControl.updateValueAndValidity();
	}

	public updateFixPrice(isCurrent: boolean) {
		let fixPriceValue;
		if (isCurrent) {
			this.resetSndCurrentParent();
			fixPriceValue = this.currentParams.controls.fixPrice.value;
		} else {
			this.resetSndNextParent();
			fixPriceValue = this.nextParams.controls.fixPrice.value;
		}
		this.updateTov(isCurrent, null, fixPriceValue);
	}

	public updateTov(
		isCurrent: boolean,
		excessIncomePercentValue: number | null,
		fixPriceValue: number | null,
	) {
		this.service
			.updateSndTov({
				clientId: this.tov.client.id,
				contractorId: this.contractorId,
				tovGroupId: this.tov.tovSubgroup.id,
				tovId: this.tov.tov.id,
				currencyId: this.currencySignal().id,
				excessIncomePercent: excessIncomePercentValue,
				fixPrice: fixPriceValue,
				isCurrent: isCurrent,
			})
			.pipe(untilDestroyed(this))
			.subscribe(value => {
				this.updateState(value);
				this.tovCommentSignal.set(value.comment);
			});
	}

	public updateState(tov: ExcessIncomeTovFromBackend) {
		this.blockValueChangeForm$.next(true);
		this.updateFromState(tov);
		this.tovSubject$.next(tov);
		this.tovSignal.set(this.mapExcessIncomeTov(this.formGroup, tov));
		this.blockValueChangeForm$.next(false);
	}

	public updateComment(comment: string | null) {
		this.service
			.updateSndTovComment({
				clientId: this.tov.client.id,
				contractorId: this.tov.contractor?.id || null,
				tovId: this.tov.tov.id,
				comment: comment,
				currencyId: this.currencySignal().id,
			})
			.pipe(untilDestroyed(this))
			.subscribe(value => {
				this.tovCommentSignal.set(value.comment);
			});
	}

	private createFormGroup(item: ExcessIncomeTovFromBackend): ExcessIncomeTov {
		this.blockValueChangeForm$.next(true);
		const formGroup: FormGroup<ExcessIncomeParamsFormTov> = new FormBuilder().group({
			currentParams: new FormBuilder().group({
				price: [item.currentParams.price],
				excessIncomePercent: [
					{
						value: item.currentParams.excessIncomePercent,
						disabled: this.canEditSnd,
					},
					compareValues(item.currentParams.excessIncomePercent),
				],
				fixPrice: [
					{
						value: item.currentParams.fixPrice,
						disabled: this.canEditSnd,
					},
					compareValues(item.currentParams.fixPrice),
				],
				finalPrice: [item.currentParams.finalPrice],
				fixPriceCurrency: [item.currentParams.fixPriceCurrency],
			}),
			nextParams: new FormBuilder().group({
				price: [item.nextParams.price],
				excessIncomePercent: [
					{
						value: item.nextParams.excessIncomePercent,
						disabled: this.canEditSnd,
					},
					compareValues(item.nextParams.excessIncomePercent),
				],
				fixPrice: [
					{
						value: item.nextParams.fixPrice,
						disabled: this.canEditSnd,
					},
					compareValues(item.nextParams.fixPrice),
				],
				finalPrice: [item.nextParams.finalPrice],
				fixPriceCurrency: [item.nextParams.fixPriceCurrency],
			}),
		});

		this.blockValueChangeForm$.next(false);
		return this.mapExcessIncomeTov(formGroup, item);
	}

	public mapExcessIncomeTov(
		formGroup: FormGroup<ExcessIncomeParamsFormTov>,
		item: ExcessIncomeTovFromBackend,
	) {
		return {
			id: item.id,
			tov: item.tov,
			client: item.client,
			contractor: item.contractor,
			category: item.category,
			tovSubgroup: item.tovSubgroup,
			status: item.status,
			paramsGroup: formGroup,
			currentParams: item.currentParams,
			nextParams: item.nextParams,
			comment: item.comment,
		};
	}

	public focusOutControl($event: FocusEvent) {
		const relatedTarget = $event.relatedTarget as HTMLElement;
		this.blockValueChangeForm$.next(true);
		if (
			relatedTarget &&
			$event.currentTarget &&
			($event.currentTarget as HTMLElement).contains(relatedTarget)
		) {
			this.blockValueChangeForm$.next(false);
			return;
		}
		this.updateFromState(this.tovSubject$.value);

		this.blockValueChangeForm$.next(false);
	}
}
