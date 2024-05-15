import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { IReturnRequestsTableItem } from '@app/pages/client-card/client-card-return-requests/return-requests-table-item';
import { IReturnRequestsFilter } from '@app/core/models/return-requests-filter';
import { ReturnRequestsFacadeService } from '@app/core/facades/return-requests-facade.service';
import { IReturnRequestsItemDto } from '@app/core/models/company/return-requests-item-dto';

@UntilDestroy()
@Component({
	selector: 'app-client-card-return-requests',
	templateUrl: './client-card-return-requests.component.html',
	styleUrls: ['./client-card-return-requests.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardReturnRequestsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: IReturnRequestsTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filter: IReturnRequestsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'ContractorId',
			type: 'search',
			label: 'Контрагент',
			searchType: 'contractor',
			placeholder: 'Выберите контрагента',
		},
		{
			name: 'AuthorId',
			type: 'search',
			label: 'Автор',
			searchType: 'user',
			placeholder: 'Выберите контрагента',
		},
	];

	public constructor(
		public readonly returnRequestsFacadeService: ReturnRequestsFacadeService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.returnRequestsFacadeService.requests$
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

		this.returnRequestsFacadeService.applyFilters(this.filter);
	}

	private mapClientsToTableItems(sales: IReturnRequestsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: IReturnRequestsTableItem = {} as IReturnRequestsTableItem;

				tableItem.code = x.id.toString() ?? '-';
				tableItem.createDate = x.createDate
					? new Date(Date.parse(x.createDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.status = x.status.name ?? '-';
				tableItem.author = x.author.name ?? '-';
				tableItem.type = x.type.name ?? '-';
				tableItem.contractor = x.contractor.name ?? '-';
				tableItem.tov = x.tov.name ?? '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(filter: { [key: string]: string }) {
		this.filter = filter as unknown as IReturnRequestsFilter;
		this.tableState = TableState.Loading;
		this.returnRequestsFacadeService.applyFilters({ ...this.filter, limit: this.pageSize });
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.returnRequestsFacadeService.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
