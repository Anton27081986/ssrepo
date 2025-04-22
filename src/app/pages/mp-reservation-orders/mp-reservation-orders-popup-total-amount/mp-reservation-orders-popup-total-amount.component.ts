import { Component } from '@angular/core';
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
	CardComponent
} from '@front-components/components';
import { NgForOf } from '@angular/common';

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
		TextComponent
	],
})
export class MpReservationOrdersPopupTotalAmountComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	constructor(
		private readonly modalRef: ModalRef,
	) {}

	public totalAmounts = [
		{ quantity: 100, desiredDate: '24.07.2024' },
		{ quantity: 200, desiredDate: '28.07.2024' },
	];

	public close(): void {
		this.modalRef.close();
	}
}
