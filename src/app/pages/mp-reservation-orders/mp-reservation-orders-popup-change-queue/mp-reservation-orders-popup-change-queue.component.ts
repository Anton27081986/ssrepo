import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	InputComponent,
	LabelComponent,
	LabelType,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	TooltipDirective,
} from '@front-components/components';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IDictionaryItemDto } from '@front-components/components';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { IProvisionType } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";

interface IQueueOrderRow {
	orderId: string;
	status: string;
	dateOrder: string;
	author: string;
	client: string;
	quantity: number;
	provision: IProvisionType;
	dateProduction: string;
	dateProvision: string;
}

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-change-queue',
	templateUrl: './mp-reservation-orders-popup-change-queue.component.html',
	styleUrls: ['./mp-reservation-orders-popup-change-queue.component.scss'],
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		CardComponent,
		ButtonComponent,
		TextComponent,
		SelectV2Component,
		InputComponent,
		FormsModule,
		FieldCtrlDirective,
		FormFieldComponent,
		ReactiveFormsModule,
		SelectComponent,
		LabelComponent,
		TooltipDirective,
		DatePipe,
		SearchInputComponent,
	],
})
export class MpReservationOrdersPopupChangeQueueComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly LabelType = LabelType;

	public tovValue: string = 'Пример ТП';
	public statusValue: string = 'В очереди';

	public readonly statusOptions: IDictionaryItemDto[] = [
		{ id: 0, name: 'Все' },
		{ id: 1, name: 'Готов' },
		{ id: 2, name: 'В очереди' },
	];

	// Массив данных очереди заказов для таблицы (заглушка)
	public ordersQueue: IQueueOrderRow[] = [
		{
			orderId: '1001',
			status: 'Готов',
			dateOrder: '01.01.2023 10:00',
			author: 'Иванов И.И.',
			client: 'Петров П.П.',
			quantity: 250,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '05.01.2023',
			dateProvision: '06.01.2023',
		},
		{
			orderId: '1002',
			status: 'В очереди',
			dateOrder: '02.01.2023 10:30',
			author: 'Сидоров С.С.',
			client: 'Козлов К.К.',
			quantity: 300,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '06.01.2023',
			dateProvision: '07.01.2023',
		},
		{
			orderId: '1001',
			status: 'В очереди',
			dateOrder: '01.01.2023 10:00',
			author: 'Иванов И.И.',
			client: 'Петров П.П.',
			quantity: 250,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '05.01.2023',
			dateProvision: '06.01.2023',
		},
		{
			orderId: '1002',
			status: 'В очереди',
			dateOrder: '02.01.2023 10:30',
			author: 'Сидоров С.С.',
			client: 'Козлов К.К.',
			quantity: 300,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '06.01.2023',
			dateProvision: '07.01.2023',
		},
		{
			orderId: '1001',
			status: 'В очереди',
			dateOrder: '01.01.2023 10:00',
			author: 'Иванов И.И.',
			client: 'Петров П.П.',
			quantity: 250,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '05.01.2023',
			dateProvision: '06.01.2023',
		},
		{
			orderId: '1002',
			status: 'В очереди',
			dateOrder: '02.01.2023 10:30',
			author: 'Сидоров С.С.',
			client: 'Козлов К.К.',
			quantity: 300,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '06.01.2023',
			dateProvision: '07.01.2023',
		},
		{
			orderId: '1001',
			status: 'В очереди',
			dateOrder: '01.01.2023 10:00',
			author: 'Иванов И.И.',
			client: 'Петров П.П.',
			quantity: 250,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '05.01.2023',
			dateProvision: '06.01.2023',
		},
		{
			orderId: '1002',
			status: 'В очереди',
			dateOrder: '02.01.2023 10:30',
			author: 'Сидоров С.С.',
			client: 'Козлов К.К.',
			quantity: 300,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '06.01.2023',
			dateProvision: '07.01.2023',
		},
		{
			orderId: '1001',
			status: 'В очереди',
			dateOrder: '01.01.2023 10:00',
			author: 'Иванов И.И.',
			client: 'Петров П.П.',
			quantity: 250,
			provision: {
				provided: 150,
				manufacturing: 200,
				provisionAvailable: 100,
				provisionUnavailable: 50,
				provisionDetails: [
					{
						productionDate: '05.01.2023',
						provisionDate: '06.01.2023',
						manufacturingAmount: 200,
					},
				],
			},
			dateProduction: '05.01.2023',
			dateProvision: '06.01.2023',
		},
	];

	protected filterQueueOrdersForm: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
		status: FormControl<IDictionaryItemDto | null>;
	}>;

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
	) {
		this.filterQueueOrdersForm = new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			status: new FormControl<IDictionaryItemDto | null>(this.statusOptions[0], [
				Validators.required,
			]),
		});
	}

	public get filteredOrdersQueue(): IQueueOrderRow[] {
		const status = this.filterQueueOrdersForm.controls.status.value;
		if (!status || status.name === 'Все') {
			return this.ordersQueue;
		}
		return this.ordersQueue.filter(item => item.status === status.name);
	}

	public close(): void {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Данные не будут сохранены',
					text: 'Вы уверены, что хотите уйти?',
				},
			})
			.afterClosed()
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	public findQueueOrders(): void {
		console.log('Поиск заказов по ТП:', this.tovValue, 'и статусу:', this.statusValue);
	}

	public applyChanges(): void {
		console.log('Применяем изменения очереди заказов...');
		this.close();
	}
}
