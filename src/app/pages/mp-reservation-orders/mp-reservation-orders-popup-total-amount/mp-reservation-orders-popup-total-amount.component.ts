import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ButtonComponent,
	ButtonType,
	IconType,
	IconPosition,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	CardComponent,
} from '@front-components/components';
import { NgForOf } from '@angular/common';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-total-amount',
	templateUrl: './mp-reservation-orders-popup-total-amount.component.html',
	styleUrls: ['./mp-reservation-orders-popup-total-amount.component.scss'],
	standalone: true,
	imports: [
		NgForOf,
		CardComponent,
		CardComponent,
		ButtonComponent,
		ButtonComponent,
		TextComponent,
		TextComponent,
	],
})
export class MpReservationOrdersPopupTotalAmountComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public orderRequests: IOrderRequests[] = [];

	constructor(
		@Inject(DIALOG_DATA) data: IOrderRequests[],
		private readonly modalRef: ModalRef,
	) {
		this.orderRequests = data.map((request) => ({
			amount: request.amount,
			requestedProvisionDate: request.requestedProvisionDate
				.split('T')[0]
				.split('-')
				.reverse()
				.join('.'),
		}));
	}

	public close(): void {
		this.modalRef.close();
	}
}
