import { Component } from '@angular/core';
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

interface IRemnantDetail {
	quantity: number;
	warehouse: string;
	linkText: string;
	linkUrl?: string;
}

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

	public remnants: IRemnantDetail[] = [
		{
			quantity: 10,
			warehouse: 'ССП Сосннаб',
			linkText: 'Ссылка',
			linkUrl: '#',
		},
		{
			quantity: 24,
			warehouse: 'ССП Готовая продукция',
			linkText: 'Ссылка',
			linkUrl: '#',
		},
	];

	constructor(private readonly modalRef: ModalRef) {}

	public close(): void {
		this.modalRef.close();
	}

	public onLinkClick(link: IRemnantDetail): void {
		console.log('Переходим по ссылке:', link.linkUrl);
	}
}
