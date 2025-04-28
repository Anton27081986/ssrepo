import { Component, Signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent, IconPosition,
	IconType,
	InputComponent,
	LabelComponent,
	LabelType,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { IProvisionType } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
		InputComponent,
		FormsModule,
		FieldCtrlDirective,
		FormFieldComponent,
		ReactiveFormsModule,
		LabelComponent,
		TooltipDirective,
		DatePipe,
		SearchInputComponent,
		TooltipDirective,
		JsonPipe,
		AsyncPipe,
		SelectComponent,
	],
})
export class MpReservationOrdersPopupChangeQueueComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly LabelType = LabelType;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly IconPosition = IconPosition;

	protected statusOptions: Signal<IDictionaryItemDto[]> = toSignal(
		this.mpReservationOrdersFacadeService.personificationStatuses$,
		{
			initialValue: [],
		},
	);

	public filterTov: IDictionaryItemDto | null = null;
	public filterStatus: IDictionaryItemDto | null = null;
	public status = new FormControl<IDictionaryItemDto | null>(null);

	public ordersQueue: IQueueOrderRow[] = [
		{
			orderId: '1001',
			status: 'Обработка ТМЗ',
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
			status: 'В производстве',
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
			status: 'В производстве',
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

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
	) {
		this.status.valueChanges
			.pipe(untilDestroyed(this))
			.subscribe(value => (this.filterStatus = value));
	}

	public get filteredOrdersQueue(): IQueueOrderRow[] {
		return this.ordersQueue.filter(order => {
			if (this.filterStatus) {
				return order.status === this.filterStatus.name;
			}
			return true;
		});
	}

	public onTovFilter(item: IDictionaryItemDto): void {
		this.filterTov = item;
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
		console.log('Поиск заказов по ТП:', this.filterTov, 'и статусу:', this.filterStatus);
	}
}
