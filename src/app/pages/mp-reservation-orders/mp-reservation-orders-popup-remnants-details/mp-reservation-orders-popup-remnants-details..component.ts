import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconType,
	IconPosition,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	LinkComponent,
} from '@front-components/components';
import { NgForOf } from '@angular/common';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { IWarehouseStockDto } from '@app/core/models/mp-reservation-orders/mp-reservation-warehouse-stock';
import {DIALOG_DATA} from "@app/core/modal/modal-tokens";

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-remnants-details',
	templateUrl:
		'./mp-reservation-orders-popup-remnants-details.component.html',
	styleUrls: [
		'./mp-reservation-orders-popup-remnants-details.component.scss',
	],
	standalone: true,
	imports: [
		NgForOf,
		CardComponent,
		CardComponent,
		ButtonComponent,
		ButtonComponent,
		TextComponent,
		TextComponent,
		LinkComponent,
	],
})
export class MpReservationOrdersPopupRemnantsDetailsComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public remnants: IWarehouseStockDto[] = [];

	constructor(
		@Inject(DIALOG_DATA) orderId: number,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
	) {
		this.mpReservationOrdersFacadeService
			.getAllStockBalance(orderId)
			.subscribe((remnants) => (this.remnants = remnants));
	}

	public close(): void {
		this.modalRef.close();
	}

	public openDetailsLink(url: string): void {
		window.open(url, '_blank');
	}
}
