import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	InputSignal,
	signal,
	WritableSignal,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { tap } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	GroupPriceHistoryComponent
} from "@app/pages/excess-income/excess-income-history/group-price-history/group-price-history.component";
import {ModalService} from "@app/core/modal/modal.service";
import {
	ProductPriceHistoryComponent
} from "@app/pages/excess-income/excess-income-history/product-price-history/product-price-history.component";
@UntilDestroy()
@Component({
	selector: 'tr[excess-income-tov-tr]',
	templateUrl: './excess-income-tov-tr.component.html',
	styleUrls: ['./excess-income-tov-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeTovTrComponent {
	public tov: InputSignal<TovNodeState> = input.required<TovNodeState>();

	protected priceCalculateCurrent: WritableSignal<number> = signal(0);

	protected priceCalculateNext: WritableSignal<number> = signal(0);

	protected sndCurrentControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);

	protected sndNextControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);

	protected fixPriceCurrentControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);
	protected fixPriceNextControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);

	protected commentControl: FormControl<string | null> = new FormControl<string | null>(
		null,
		Validators.required,
	);

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		protected readonly excessIncomeService: ExcessIncomeService,
		private readonly modalService: ModalService,
	) {
		effect(() => {
			this.sndCurrentControl.setValue(this.tov().tov.currentParams.excessIncomePercent);
			this.sndNextControl.setValue(this.tov().tov.nextParams.excessIncomePercent);
		});

		this.sndNextControl.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(value => {
					this.fixPriceNextControl.setValue(null, { emitEvent: false });
					if (value) {
						this.priceCalculateNext.set(
							this.calculateFinalPrice(this.tov().tov.currentParams.price, value),
						);
					} else {
						this.priceCalculateNext.set(this.tov().tov.nextParams.finalPrice ?? 0);
					}
				}),
			)
			.subscribe();

		this.fixPriceNextControl.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(value => {
					this.sndNextControl.setValue(null, { emitEvent: false });
					if (value) {
						this.priceCalculateNext.set(value);
					}
				}),
			)
			.subscribe();
	}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	protected updateSndTov() {
		if (this.sndCurrentControl.valid || this.sndNextControl.valid) {
			this.update();
		}
	}

	private calculateFinalPrice(price: number, snd: number): number {
		return price + (snd / 100) * price;
	}

	checkSndCurrentControl($event: number) {
		this.fixPriceCurrentControl.setValue(null, { emitEvent: false });
		if ($event) {
			this.priceCalculateCurrent.set(
				this.calculateFinalPrice(this.tov().tov.currentParams.price, $event),
			);
		}
	}

	checkFixPriceCurrentControl($event: number) {
		this.sndCurrentControl.setValue(null, { emitEvent: false });
		if ($event) {
			this.priceCalculateCurrent.set($event);
		}
	}

	update() {
		this.excessIncomeService
			.updateSndTov({
				clientId: this.tov().tov.client.id,
				contractorId: this.tov().tov.contractor.id,
				tovGroupId: this.tov().tov.tovSubgroup.id,
				tovId: this.tov().tov.tov.id,
				currencyId: this.tov().state.currencyControl.value!.id,
				currentFixPrice: this.fixPriceCurrentControl.value,
				nextFixPrice: this.fixPriceNextControl.value,
				currentExcessIncomePercent: this.sndCurrentControl.value,
				nextExcessIncomePercent: this.sndNextControl.value,
			})
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	updateComment() {
		this.excessIncomeService.updateSndTovComment({
			clientId: this.tov().tov.client.id,
			contractorId: this.tov().tov.contractor.id,
			tovId: this.tov().tov.tovSubgroup.id,
			comment: this.commentControl.value!,
		});
	}

	protected openHistory() {
		this.modalService
			.open(ProductPriceHistoryComponent, {
				data: {
					clientId: this.tov().tov.client.id,
					contractorId: this.tov().tov.contractor.id,
					tovId: this.tov().tov.tov.id,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}
}
