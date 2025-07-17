import { Component, inject, Signal } from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	Colors,
	IconComponent,
	IconPosition,
	IconType,
	LabelComponent,
	LabelType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	TooltipDirective,
} from '@front-components/components';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import {
	FiltersComponent,
	IFilter,
} from '@app/shared/components/filters/filters.component';
import { PaginationTrComponent } from '@app/shared/components/pagination-tr/pagination-tr.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { IResponse } from '@app/core/utils/response';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '@app/core/modal/modal.service';
import { MpReservationOrdersPopupDateProvisionComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-date-provision/mp-reservation-orders-popup-date-provision.component';
import { Router } from '@angular/router';
import { MpReservationOrdersPopupHistoryComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history..component';
import { MpReservationOrdersPopupRemnantsDetailsComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-remnants-details/mp-reservation-orders-popup-remnants-details..component';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { ChartLineComponent } from '@app/shared/components/chart-line/chart-line.component';
import { MpReservationOrdersPopupAddOrderComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-add-order/mp-reservation-orders-popup-add-order.component';
import { MpReservationOrdersPopupTotalAmountComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-total-amount/mp-reservation-orders-popup-total-amount.component';
import { MpReservationOrdersPopupChangeQueueComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-change-queue/mp-reservation-orders-popup-change-queue.component';
import { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';
import {
	Permissions,
	PermissionType,
} from '@app/core/constants/permissions.constants';

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
		DatePipe,
		ChartLineComponent,
		CheckboxComponent,
		LinkComponent,
		LinkComponent,
		TooltipDirective,
		LabelComponent,
		IconComponent,
		TagV2Component,
		NumWithSpacesPipe,
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
	protected readonly LabelType = LabelType;
	protected readonly Colors = Colors;

	public pageSize = 10;
	public offset = 0;
	public pageIndex = 1;

	public selectedOrders: Set<number> = new Set<number>();

	permissionService: PermissionsFacadeService = inject(
		PermissionsFacadeService,
	);

	get hasPermissionAddOrder(): boolean {
		return this.permissionService.hasPermission(
			ModulesWithPermissionsEnum.MpReservationOrders,
			Permissions.PERSONIFICATION_ORDER_AUTHOR_CREATE,
		);
	}

	public orders: Signal<IResponse<IMpReservationOrder> | null> = toSignal(
		this.mpReservationOrdersFacadeService.orders$,
		{
			initialValue: null,
		},
	);
	public isLoader: Signal<boolean> = toSignal(
		this.mpReservationOrdersFacadeService.isLoader$,
		{
			initialValue: true,
		},
	);

	public filters: IFilter[] = [
		{
			name: 'id',
			type: 'number',
			label: 'Код',
			placeholder: 'Введите код',
		},
		{
			name: 'authorId',
			type: 'search-select',
			searchType: 'user',
			label: 'Заказчик',
			placeholder: '',
		},
		{
			name: 'tovId',
			type: 'search-select',
			searchType: 'tovs',
			label: 'Товарная позиция',
			placeholder: '',
		},
		{
			name: 'managerId',
			type: 'search-select',
			searchType: 'user',
			label: 'МУТМЗ',
			placeholder: '',
		},
		{
			name: 'statusId',
			type: 'search-select',
			searchType: 'personificationStatuses',
			label: 'Статус',
			placeholder: '',
		},
		{
			name: 'dateCreatedFrom-dateCreatedTo',
			type: 'date-range',
			label: 'Дата создания',
			placeholder: '',
		},
		{
			name: 'clientId',
			type: 'search-select',
			searchType: 'client',
			label: 'Клиент',
			placeholder: '',
		},
	];

	constructor(
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly modalService: ModalService,
		private readonly router: Router,
	) {
		this.getFilteredOrders();
	}

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
			limit: isNewFilter ? 10 : this.pageSize,
			offset: isNewFilter ? 0 : this.offset,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] =
				filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map((item) => item.id)
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

		this.mpReservationOrdersFacadeService.applyFiltersOrders(
			preparedFilter,
		);
	}

	public ordersTableIndexChange($event: number): void {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredOrders();
	}

	public onCheckboxChange(event: Event, orderId: number): void {
		const checkbox = event.target as HTMLInputElement;

		if (checkbox.checked) {
			this.selectedOrders.add(orderId);
		} else {
			this.selectedOrders.delete(orderId);
		}
	}

	public isAllSelected(): boolean {
		return (
			(this.orders()?.items || []).length > 0 &&
			(this.orders()?.items || []).every((order) =>
				this.selectedOrders.has(order.id),
			)
		);
	}

	public toggleSelectAll(event: Event): void {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.orders()?.items.forEach((order) =>
				this.selectedOrders.add(order.id),
			);
		} else {
			this.orders()?.items.forEach((order) =>
				this.selectedOrders.delete(order.id),
			);
		}
	}

	public openPopupDateProvision(): void {
		this.modalService.open(MpReservationOrdersPopupDateProvisionComponent, {
			data: this.selectedOrders,
		});
	}

	public goToOrderCard(orderId: number): void {
		const urlTree = this.router.createUrlTree(['mp-reservation-orders', orderId]);
		const url = this.router.serializeUrl(urlTree);
		window.open(url, '_blank');
	}

	public openPopupHistoryOrder(orderId: number): void {
		this.modalService.open(MpReservationOrdersPopupHistoryComponent, {
			data: orderId,
		});
	}

	public openPopupAddOrder(): void {
		this.modalService
			.open(MpReservationOrdersPopupAddOrderComponent)
			.afterClosed()
			.subscribe((createdOrders: IMpReservationAddOrder | undefined) => {
				if (createdOrders?.items.length) {
					const totalBefore = this.orders()?.total ?? 0;
					const totalAfter = totalBefore + createdOrders.items.length;
					const lastPageIndex = Math.ceil(totalAfter / this.pageSize);

					this.ordersTableIndexChange(lastPageIndex);
				}
			});
	}

	public openPopupRemnantDetailsOrder(orderId: number): void {
		this.modalService.open(
			MpReservationOrdersPopupRemnantsDetailsComponent,
			{ data: orderId },
		);
	}

	public openPopupTotalAmount(): void {
		this.modalService.open(MpReservationOrdersPopupTotalAmountComponent);
	}

	public openPopupChangeQueueOrders(): void {
		this.modalService.open(MpReservationOrdersPopupChangeQueueComponent);
	}
}
