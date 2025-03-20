import { Component, Signal } from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	IconPosition,
	IconType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { FiltersComponent, IFilter } from '@app/shared/components/filters/filters.component';
import { PaginationTrComponent } from '@app/shared/components/pagination-tr/pagination-tr.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { IResponse } from '@app/core/utils/response';
import { toSignal } from '@angular/core/rxjs-interop';
import { IMpReservationOrders } from '@app/core/models/mp-reservation-orders/mp-reservation-orders';
import {ModalService} from "@app/core/modal/modal.service";
import {
	MpReservationOrdersPopupDateProvisionComponent
} from "@app/pages/mp-reservation-orders/mp-reservation-orders-popup-date-provision/mp-reservation-orders-popup-date-provision.component";
import {Router} from "@angular/router";
import {
	CompletedWorkActHistoryComponent
} from "@app/pages/completed-work-acts/completed-work-act-history/completed-work-act-history.component";
import {
	MpReservationOrdersPopupHistoryComponent
} from "@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history..component";

@Component({
	selector: 'app-mp-reservation-orders',
	templateUrl: './mp-reservation-orders.component.html',
	styleUrls: ['./mp-reservation-orders.component.scss'],
	imports: [
		TextComponent,
		ButtonComponent,
		SelectV2Component,
		ReactiveFormsModule,
		TableV2Component,
		AsyncPipe,
		DropdownButtonComponent,
		FiltersComponent,
		PaginationTrComponent,
		PaginationComponent,
		LinkComponent,
		NgForOf,
		NgIf,
	],
	standalone: true,
})
export class MPReservationOrdersComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public pageSize = 10;
	public offset = 0;
	public pageIndex = 1;

	public selectedOrders: Set<string> = new Set<string>();

	public ordersMok = Array.from({ length: 50 }, (_, index) => ({
		orderCode: `123${index + 1}`,
		requestNumber: `REQ-${1000 + index}`,
		status: index % 2 === 0 ? 'В обработке' : 'Завершен',
		orderDate: `2025-03-${(index % 30) + 1}`,
		customer: `Заказчик ${index + 1}`,
		tp: `Товар ${index + 1}`,
		quantity: Math.floor(Math.random() * 10) + 1,
		unit: 'шт',
		provision: index % 2 === 0 ? 'Да' : 'Нет',
		mutmz: `${200 + index}`,
		stock: `${Math.floor(Math.random() * 50)}`,
		productionDate: `2025-03-${(index % 30) + 1}`,
		provisionDate: `2025-03-${(index % 30) + 5}`,
	}));

	public filters: IFilter[] = [
		{
			name: 'code',
			type: 'number',
			label: 'Код',
			placeholder: 'Введите код',
		},
		{
			name: 'applicationCode',
			type: 'number',
			label: 'Заявка на продажу/перемещение',
			placeholder: 'Введите код заявки',
		},
		{
			name: 'customerId',
			type: 'search-select',
			searchType: 'user',
			label: 'Заказчик',
			placeholder: '',
		},
		{
			name: 'tov',
			type: 'search-select',
			searchType: 'tov-company',
			label: 'Товарная позиция',
			placeholder: '',
		},
		{
			name: 'mutmz',
			type: 'search-select',
			label: 'МУТМЗ',
			placeholder: '',
		},
		{
			name: 'status',
			type: 'search-select',
			label: 'Статус',
			placeholder: '',
		},
		{
			name: 'date',
			type: 'date-range',
			label: 'Дата создания',
			placeholder: '',
		},
	];

	constructor(
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly modalService: ModalService,
		private readonly router: Router
	) {}

	public orders: Signal<IResponse<IMpReservationOrders> | null> = toSignal(
		this.mpReservationOrdersFacadeService.orders$,
		{
			initialValue: null,
		},
	);

	protected downloadInstr() {
		//TODO поменять ссылку на нужную инструкцию
		let instructionFileLink =
			'https://erp.ssnab.ru/api/static/general/2025/02/14/Инструкция_Управление_СНД_59605308-9107-4c29-8a42-89143dfde87c.docx';
		const link = document.createElement('a');

		link.href = instructionFileLink;
		link.click();
	}

	public getFilteredOrders(isNewFilter: boolean = false) {
		if (isNewFilter) {
			this.pageIndex = 1;
		}

		const preparedFilter: any = {
			limit: isNewFilter ? 20 : this.pageSize,
			offset: isNewFilter ? 0 : this.offset,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map(item => item.id) // Массив значений (например, список заказчиков или статусов)
						: null;
					break;

				case 'date-range':
					const from =
						filter.value && typeof filter.value === 'string'
							? filter.value.split('-')[0].split('.')
							: null;

					preparedFilter[filter.name.split('-')[0]] = from
						? `${[from[2], from[1], parseInt(from[0], 10)].join('-')}T00:00:00.000Z`
						: null;

					const to =
						filter.value && typeof filter.value === 'string'
							? filter.value.split('-')[1].split('.')
							: null;

					preparedFilter[filter.name.split('-')[1]] = to
						? `${[to[2], to[1], parseInt(to[0], 10)].join('-')}T23:59:59.999Z`
						: null;
					break;

				default:
					preparedFilter[filter.name] =
						filter.value?.toString().replace(',', '.') || null;
			}
		}

		this.mpReservationOrdersFacadeService.applyFiltersOrders(preparedFilter);
	}

	public ordersTableIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredOrders();
	}

	public onCheckboxChange(event: Event, orderCode: string): void {
		const checkbox = event.target as HTMLInputElement;

		if (checkbox.checked) {
			this.selectedOrders.add(orderCode);
		} else {
			this.selectedOrders.delete(orderCode);
		}
	}
	public isAllSelected(): boolean {
		return (
			this.ordersMok.length > 0 &&
			this.ordersMok.every(order => this.selectedOrders.has(order.orderCode))
		);
	}

	public toggleSelectAll(event: Event): void {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.ordersMok.forEach(order => this.selectedOrders.add(order.orderCode));
		} else {
			this.ordersMok.forEach(order => this.selectedOrders.delete(order.orderCode));
		}
	}

	public openPopupDateProvision(): void {
		//TODO уточнить логику по определению заказов и даты для них.
		this.modalService.open(MpReservationOrdersPopupDateProvisionComponent, { data: this.selectedOrders });
	}

	public goToOrderCard(orderId: string):void {
		this.router.navigate(['mp-reservation-orders', orderId]);
	}

	public openPopupHistoryOrder(orderId: string): void {
		this.modalService.open(MpReservationOrdersPopupHistoryComponent, { data: orderId });
	}

}
