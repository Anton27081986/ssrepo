import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { SaleRequestsFacadeService } from '@app/core/facades/sale-requests-facade.service';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { ISaleTableItem } from '@app/pages/client-card/client-sale-requests/sale-table-item';
import { TableState } from '@app/shared/components/table/table-state';

@UntilDestroy()
@Component({
	selector: 'app-sale-requests',
	templateUrl: './client-sale-requests.component.html',
	styleUrls: ['./client-sale-requests.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientSaleRequestsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: ISaleTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filter: ISaleRequestsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'ContractorId',
			type: 'input',
			label: 'Контрагент',
			placeholder: '',
		},
		{
			name: 'FromShipDate',
			type: 'date',
			label: 'Дата отгрузки',
			placeholder: '',
		},
	];

	public constructor(
		public readonly saleRequestsFacade: SaleRequestsFacadeService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.saleRequestsFacade.applyFilters(this.filter);

		this.saleRequestsFacade.sales$.pipe(untilDestroyed(this)).subscribe(response => {
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
	}

	private mapClientsToTableItems(sales: ISaleRequestsDto) {
		return (
			sales.items?.map(x => {
				const tableItem: ISaleTableItem = {} as ISaleTableItem;

				tableItem.code = x.id !== undefined ? x.id.toString() : '-';
				tableItem.saleLink = x.detailLink !== undefined ? x.detailLink : '';
				tableItem.contractorId = x.contractor?.id.toString(10) ?? '-';
				tableItem.shipDate = x.shipDate
					? new Date(Date.parse(x.shipDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.paymentDate = x.paymentDate
					? new Date(Date.parse(x.paymentDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';

				tableItem.status = x.status !== undefined ? x.status.name : '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(filter: { [key: string]: string }) {
		this.filter = filter as unknown as ISaleRequestsFilter;
		this.tableState = TableState.Loading;
		this.saleRequestsFacade.applyFilters({ ...this.filter, limit: this.pageSize });
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.saleRequestsFacade.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
