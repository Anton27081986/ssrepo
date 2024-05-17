import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { INewProductsTableItem } from '@app/pages/client-card/client-card-new-products/new-products-table-item';
import { INewProductsFilter } from '@app/core/models/new-products-filter';
import { NewProductsFacadeService } from '@app/core/facades/new-products-facade.service';
import { INewProductsItemDto } from '@app/core/models/company/new-products-item-dto';

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
	public tableItems: ITableItem[] = [];
	public items: INewProductsTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filter: INewProductsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'customerIds',
			type: 'search-select',
			label: 'Заказчик',
			searchType: 'user',
			placeholder: 'Выберите заказчика',
		},
	];

	public constructor(
		public readonly newProductsFacadeService: NewProductsFacadeService,
		private readonly cdr: ChangeDetectorRef,
	) {}

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

		this.newProductsFacadeService.applyFilters(this.filter);
	}

	private mapClientsToTableItems(sales: INewProductsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: INewProductsTableItem = {} as INewProductsTableItem;

				tableItem.code = x.id.toString() ?? '-';
				tableItem.status = x.status.name ?? '-';
				tableItem.productName = x.productName ?? '-';
				tableItem.customer = x.customer.name ?? '-';
				tableItem.developer = x.developer.name ?? '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(filter: { [key: string]: string }) {
		this.filter = filter as unknown as INewProductsFilter;
		this.tableState = TableState.Loading;
		this.newProductsFacadeService.applyFilters({ ...this.filter, limit: this.pageSize });
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.newProductsFacadeService.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
