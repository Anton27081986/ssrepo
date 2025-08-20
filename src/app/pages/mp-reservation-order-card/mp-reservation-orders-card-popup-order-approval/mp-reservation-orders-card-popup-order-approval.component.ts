import { Component, Signal } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	FormControl,
	FormGroup,
	FormArray,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { NgForOf, NgIf } from '@angular/common';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { toSignal } from '@angular/core/rxjs-interop';
import { IWarehouseStockDto } from '@app/core/models/mp-reservation-orders/mp-reservation-warehouse-stock';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-card-popup-order-approval',
	templateUrl:
		'./mp-reservation-orders-card-popup-order-approval.component.html',
	styleUrls: [
		'./mp-reservation-orders-card-popup-order-approval.component.scss',
	],
	standalone: true,
	imports: [
		CardComponent,
		ReactiveFormsModule,
		ButtonComponent,
		TextComponent,
		InputComponent,
		NgForOf,
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		NgIf,
	],
})
export class MpReservationOrdersCardPopupOrderApprovalComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public stockBalance: IWarehouseStockDto[] = [];

	public order: Signal<IMpReservationOrder | null> = toSignal(
		this.mpReservationOrderCardFacadeService.activeOrder$,
		{
			initialValue: null,
		}
	);

	public approvalForm = new FormGroup({
		tov: new FormControl<IDictionaryItemDto | null>(null, [
			Validators.required,
		]),
		totalRequested: new FormControl<number | null>(null, [
			Validators.required,
		]),
		manufacturingAmount: new FormControl<number | null>(null, [
			Validators.required,
		]),
		stocks: new FormArray<
			FormGroup<{
				warehouseName: FormControl<string>;
				inStock: FormControl<number | null>;
				fact: FormControl<number | null>;
			}>
		>([]),
	});

	constructor(
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService
	) {
		const orderId = this.order()!.id;

		this.mpReservationOrderCardFacadeService.loadWarehouseBalance(orderId);

		this.mpReservationOrderCardFacadeService.warehouseBalance$
			.pipe(untilDestroyed(this))
			.subscribe((data) => {
				if (!data) {
					return;
				}

				this.stockBalance = data.stocks;

				this.approvalForm.patchValue({
					tov: data.tov,
					totalRequested: data.totalRequested,
					manufacturingAmount: data.manufacturingAmount,
				});

				const stocksArr = this.approvalForm.get('stocks') as FormArray;

				stocksArr.clear();
				data.stocks.forEach((stock) => {
					stocksArr.push(
						new FormGroup({
							warehouseId: new FormControl<number>(
								stock.warehouse.id
							),
							warehouseName: new FormControl<string>(
								stock.warehouse.name
							),
							inStock: new FormControl<number | null>(
								stock.amount
							),
							fact: new FormControl<number | null>(null),
						})
					);
				});
			});
	}

	public get dates(): FormArray {
		return this.approvalForm.get('stocks') as FormArray;
	}

	public submitDispatch(): void {
		if (this.approvalForm.invalid) {
			return;
		}

		const orderId = this.order()?.id;

		if (!orderId) {
			return;
		}

		const dispatches = this.dates.controls
			.map((row) => ({
				warehouseId: row.get('warehouseId')?.value as number,
				amount: row.get('fact')?.value as number,
			}))
			.filter(({ amount }) => amount > 0);

		if (!dispatches.length) {
			return;
		}

		this.mpReservationOrderCardFacadeService.dispatchToQueue(
			orderId,
			dispatches
		);
		this.close();
		this.mpReservationOrderCardFacadeService.reloadOrder();
	}

	public close(): void {
		this.modalRef.close();
	}
}
