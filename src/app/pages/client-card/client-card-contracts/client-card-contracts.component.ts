import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { IContractsTableItem } from '@app/pages/client-card/client-card-contracts/contracts-table-item';
import { IContractsFilter } from '@app/core/models/contracts-filter';
import { ContractsFacadeService } from '@app/core/facades/contracts-facade.service';
import { IContractsItemDto } from '@app/core/models/company/contracts-item-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

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
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IContractsTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Empty;

	public filters: IFilter[] = [
		{
			name: 'ContractorId',
			type: 'search',
			searchType: 'contractor',
			label: 'Контрагент',
			placeholder: 'Выберите контрагента',
		},
	];

	public constructor(
		public readonly contractsFacadeService: ContractsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
	}

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

		this.clientCardListFacade.client$.pipe(untilDestroyed(this)).subscribe(client => {
			if (client.id) {
				this.clientId = client.id;
				this.getFilteredSales();
			}
		});

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

	public getFilteredSales() {
		const preparedFilter: any = {
			limit: this.pageSize,
			offset: this.offset,
			clientId: this.clientId,
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

		this.contractsFacadeService.applyFilters(preparedFilter);
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
