import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { INewProductsTableItem } from '@app/pages/client-card/client-card-new-products/new-products-table-item';
import { NewProductsFacadeService } from '@app/core/facades/new-products-facade.service';
import { INewProductsItemDto } from '@app/core/models/company/new-products-item-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-card-new-products',
	templateUrl: './client-card-new-products.component.html',
	styleUrls: ['./client-card-new-products.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardNewProductsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: INewProductsTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Empty;

	public filters: IFilter[] = [
		{
			name: 'customerId',
			type: 'search',
			label: 'Заказчик',
			searchType: 'user',
			placeholder: 'Выберите заказчика',
		},
	];

	public constructor(
		public readonly newProductsFacadeService: NewProductsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.newProductsFacadeService.newProducts$
			.pipe(untilDestroyed(this))
			.subscribe(response => {
				if (!response.items || response.items.length === 0) {
					this.tableState = TableState.Empty;
				} else {
					this.items = this.mapClientsToTableItems(response);
					this.total = (response.total ?? 0) + this.pageSize;
					this.tableItems = <ITableItem[]>(<unknown>this.items);
					this.tableState = TableState.Full;
				}

				this.cdr.detectChanges();
			});
		this.clientCardListFacade.client$.pipe(untilDestroyed(this)).subscribe(client => {
			if (client.id) {
				this.clientId = client.id;;

				this.getFilteredSales();
			}
		})
	}

	private mapClientsToTableItems(sales: INewProductsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: INewProductsTableItem = {} as INewProductsTableItem;

				tableItem.code = x.id.toString() ?? '-';
				tableItem.status = x.status.name ?? '-';
				tableItem.productName = x.productName ?? '-';
				tableItem.customer = x.customer?.name ?? '-';
				tableItem.developer = x.developer?.name ?? '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales() {
		const preparedFilter: any = {
			limit: this.pageSize,
			offset: this.offset,
			СlientId: this.clientId,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'select':
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map(item => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] = filter.value === 'Да' ? true : null;
					break;
				case 'search':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value[0]?.id
						: null;
					break;
				default:
					preparedFilter[filter.name] = filter.value || null;
			}
		}

		this.newProductsFacadeService.applyFilters(preparedFilter);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredSales();
	}

	protected readonly TableState = TableState;
}
