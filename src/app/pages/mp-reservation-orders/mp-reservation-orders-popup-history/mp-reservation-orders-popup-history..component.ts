import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
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
} from '@front-components/components';
import { NgForOf } from '@angular/common';

export interface IHistoryEntry {
	author: string;
	action: string;
	comment: string;
	toWhom: string;
	date: string; // либо Date, если вы хотите форматировать вручную
}

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-history',
	templateUrl: './mp-reservation-orders-popup-history.component.html',
	styleUrls: ['./mp-reservation-orders-popup-history.component.scss'],
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
export class MpReservationOrdersPopupHistoryComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public historyEntries: IHistoryEntry[] = [
		{
			author: 'Маслова (Гольская) М.Н.',
			action: 'Начать апробацию образца',
			comment: 'Пример текста к действию',
			toWhom: 'Бородулин A.C., Шубинкова A.K.',
			date: '08.10.2024 17:00',
		},
		{
			author: 'Маслова (Гольская) М.Н.',
			action: 'Начать апробацию образца',
			comment: 'im ipsum dolor sit amet, consectetur adipiscing elit...',
			toWhom: 'Бородулин A.C.',
			date: '09.10.2024 11:20',
		},
	];

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService
	) {}

	public close(): void {
		this.modalRef.close();
	}
}
