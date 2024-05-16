import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { IContractsTableItem } from '@app/pages/client-card/client-card-contracts/contracts-table-item';
import { IContractsFilter } from '@app/core/models/contracts-filter';
import { ContractsFacadeService } from '@app/core/facades/contracts-facade.service';
import { IContractsItemDto } from '@app/core/models/company/contracts-item-dto';

@UntilDestroy()
@Component({
	selector: 'app-client-card-contracts',
	templateUrl: './client-card-contracts.component.html',
	styleUrls: ['./client-card-contracts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardContractsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: IContractsTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filter: IContractsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'ContractorId',
			type: 'input',
			label: 'Контрагент',
			placeholder: 'Выберите контрагента',
		},
	];

	public constructor(
		public readonly contractsFacadeService: ContractsFacadeService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.contractsFacadeService.contracts$.pipe(untilDestroyed(this)).subscribe(response => {
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

		this.contractsFacadeService.applyFilters(this.filter);
	}

	private mapClientsToTableItems(sales: IContractsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: IContractsTableItem = {} as IContractsTableItem;

				tableItem.code = x.id.toString() ?? '-';
				tableItem.detailLink = x.detailLink ?? '';
				tableItem.contractor = x.contractor.name ?? '-';
				tableItem.beginDate = x.beginDate
					? new Date(Date.parse(x.beginDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.endDate = x.endDate
					? new Date(Date.parse(x.endDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.prolongationDate = x.endDate
					? new Date(Date.parse(x.prolongationDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';

				tableItem.isSoonExpire = x.isSoonExpire ?? false;

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(filter: { [key: string]: string }) {
		this.filter = filter as unknown as IContractsFilter;
		this.tableState = TableState.Loading;
		this.contractsFacadeService.applyFilters({ ...this.filter, limit: this.pageSize });
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.contractsFacadeService.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
