import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	IconComponent,
	IconPosition,
	IconType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	TooltipDirective,
} from '@front-components/components';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import {
	FiltersComponent,
	IFilter,
} from '@app/shared/components/filters/filters.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '@app/core/modal/modal.service';
import { MpReservationOrdersPopupDateProvisionComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-date-provision/mp-reservation-orders-popup-date-provision.component';
import { Router } from '@angular/router';
import { MpReservationOrdersPopupHistoryComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history..component';
import { MpReservationOrdersPopupRemnantsDetailsComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-remnants-details/mp-reservation-orders-popup-remnants-details..component';
import { MpReservationOrdersPopupAddOrderComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-add-order/mp-reservation-orders-popup-add-order.component';
import { MpReservationOrdersPopupTotalAmountComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-total-amount/mp-reservation-orders-popup-total-amount.component';
import { MpReservationOrdersPopupChangeQueueComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-change-queue/mp-reservation-orders-popup-change-queue.component';
import { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';
import { Permissions } from '@app/core/constants/permissions.constants';
import { FilterBuilder } from '@app/core/utils/filter-builder.util';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

@Component({
	selector: 'app-mp-reservation-orders',
	templateUrl: './mp-reservation-orders.component.html',
	styleUrls: ['./mp-reservation-orders.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TextComponent,
		ButtonComponent,
		ReactiveFormsModule,
		DropdownButtonComponent,
		FiltersComponent,
		PaginationComponent,
		LinkComponent,
		NgForOf,
		NgIf,
		DatePipe,
		TooltipDirective,
		IconComponent,
		TagV2Component,
		NumWithSpacesPipe,
	],
})
export class MPReservationOrdersComponent implements OnInit {
	private static readonly defaultPageSize = 10;
	private static readonly instructionFileLink =
		'https://erp.ssnab.ru/api/static/general/2025/02/14/Инструкция_Управление_СНД_59605308-9107-4c29-8a42-89143dfde87c.docx';

	// Protected readonly для template access
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
	protected readonly Colors = Colors;

	// Signals для реактивного состояния
	protected readonly pageSize = signal(
		MPReservationOrdersComponent.defaultPageSize
	);

	protected readonly pageIndex = signal(1);
	protected readonly selectedOrderIds = signal<Set<number>>(new Set());

	// Computed для производных значений
	protected readonly offset = computed(() =>
		this.pageIndex() === 1 ? 0 : this.pageSize() * (this.pageIndex() - 1)
	);

	protected readonly isAllSelected = computed(() => {
		const items = this.orders()?.items || [];
		const selectedIds = this.selectedOrderIds();

		return (
			items.length > 0 &&
			items.every((order) => selectedIds.has(order.id))
		);
	});

	// Services
	private readonly mpReservationOrdersFacadeService = inject(
		MpReservationOrdersFacadeService
	);

	private readonly modalService = inject(ModalService);
	private readonly router = inject(Router);
	private readonly permissionService = inject(PermissionsFacadeService);

	// External state via toSignal
	protected readonly orders = toSignal(
		this.mpReservationOrdersFacadeService.orders$,
		{ initialValue: null }
	);

	protected readonly isLoader = toSignal(
		this.mpReservationOrdersFacadeService.isLoader$,
		{ initialValue: true }
	);

	protected readonly hasPermissionAddOrder = computed(() =>
		this.permissionService.hasPermission(
			ModulesWithPermissionsEnum.MpReservationOrders,
			Permissions.PERSONIFICATION_ORDER_AUTHOR_CREATE
		)
	);

	// Filter configuration
	protected filters = signal<IFilter[]>([
		{
			name: 'personificationId',
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
			searchType: 'tovsManufacturing',
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
	]);

	public ngOnInit(): void {
		this.loadOrders();
	}

	protected downloadInstr(): void {
		const link = document.createElement('a');

		link.href = MPReservationOrdersComponent.instructionFileLink;
		link.click();
	}

	public getFilteredOrders(isNewFilter: boolean = false): void {
		if (isNewFilter) {
			this.resetPagination();
		}

		this.loadOrders();
	}

	public onFiltersChange(updatedFilters: IFilter[]): void {
		this.filters.set(updatedFilters);
	}

	private loadOrders(): void {
		const pagination = {
			limit: this.pageSize(),
			offset: this.offset(),
		};

		const preparedFilter = FilterBuilder.buildMpReservationFilter(
			this.filters(),
			pagination
		);

		this.mpReservationOrdersFacadeService.applyFiltersOrders(
			preparedFilter
		);
	}

	private resetPagination(): void {
		this.pageIndex.set(1);
	}

	public ordersTableIndexChange(newPageIndex: number): void {
		this.pageIndex.set(newPageIndex);
		this.loadOrders();
	}

	public onCheckboxChange(event: Event, orderId: number): void {
		const checkbox = event.target as HTMLInputElement;
		const currentSelected = new Set(this.selectedOrderIds());

		if (checkbox.checked) {
			currentSelected.add(orderId);
		} else {
			currentSelected.delete(orderId);
		}

		this.selectedOrderIds.set(currentSelected);
	}

	public toggleSelectAll(event: Event): void {
		const checkbox = event.target as HTMLInputElement;
		const items = this.orders()?.items || [];
		const newSelected = new Set<number>();

		if (checkbox.checked) {
			items.forEach((order) => newSelected.add(order.id));
		}

		this.selectedOrderIds.set(newSelected);
	}

	public openPopupDateProvision(): void {
		this.modalService.open(MpReservationOrdersPopupDateProvisionComponent, {
			data: this.selectedOrderIds(),
		});
	}

	public goToOrderCard(orderId: number): void {
		const urlTree = this.router.createUrlTree([
			'mp-reservation-orders',
			orderId,
		]);
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
					this.navigateToLastPageWithNewOrders(
						createdOrders.items.length
					);
				}
			});
	}

	private navigateToLastPageWithNewOrders(newOrdersCount: number): void {
		const totalBefore = this.orders()?.total ?? 0;
		const totalAfter = totalBefore + newOrdersCount;
		const lastPageIndex = Math.ceil(totalAfter / this.pageSize());

		this.ordersTableIndexChange(lastPageIndex);
	}

	public openPopupRemnantDetailsOrder(orderId: number): void {
		this.modalService.open(
			MpReservationOrdersPopupRemnantsDetailsComponent,
			{ data: orderId }
		);
	}

	public openPopupTotalAmount(order: IMpReservationOrder): void {
		this.modalService.open(MpReservationOrdersPopupTotalAmountComponent, {
			data: order.orderRequests,
		});
	}

	public openPopupChangeQueueOrders(): void {
		this.modalService.open(MpReservationOrdersPopupChangeQueueComponent);
	}
}
