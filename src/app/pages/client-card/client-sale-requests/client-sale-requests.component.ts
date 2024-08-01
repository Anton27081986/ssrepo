import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { SaleRequestsFacadeService } from '@app/core/facades/sale-requests-facade.service';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { ISaleTableItem } from '@app/pages/client-card/client-sale-requests/sale-table-item';
import { TableState } from '@app/shared/components/table/table-state';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-sale-requests',
	templateUrl: './client-sale-requests.component.html',
	styleUrls: ['./client-sale-requests.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientSaleRequestsComponent implements OnInit {
	public sales$: Observable<ISaleRequestsDto | null>;

	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: ISaleTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible: boolean = false;
	public tableState: TableState = TableState.Empty;

	public filters: IFilter[] = [
		{
			name: 'ContractorId',
			type: 'search',
			searchType: 'contractor',
			label: 'Контрагент',
			placeholder: 'Введите наименование контрагента',
		},
		{
			name: 'FromShipDate-ToShipDate',
			type: 'date-range',
			label: 'Дата отгрузки',
			placeholder: '',
		},
		{
			name: 'WithPaymentOverdue',
			type: 'boolean',
			label: 'Только просроченные',
			options: [
				{ id: 1, name: 'Да' },
				{ id: 0, name: 'Нет' },
			],
			placeholder: '',
		},
	];

	public constructor(
		public readonly saleRequestsFacade: SaleRequestsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
		this.sales$ = this.saleRequestsFacade.sales$;
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.saleRequestsFacade.sales$.pipe(untilDestroyed(this)).subscribe(response => {
			if (!response.items || response.items.length === 0) {
				this.tableState = TableState.Empty;
			} else {
				this.items = this.mapClientsToTableItems(response);

				if (response.total! > 6) {
					this.total = (response.total ?? 0) + this.pageSize;
				} else {
					this.total = response.total ?? 0;
				}

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

	private mapClientsToTableItems(sales: ISaleRequestsDto) {
		return (
			sales.items?.map(x => {
				const tableItem: ISaleTableItem = {} as ISaleTableItem;

				tableItem.code = {
					text: x.id !== undefined ? x.id.toString() : '-',
					url: x.detailLink !== undefined ? x.detailLink : '',
				};
				tableItem.contractor = x.contractor?.name ?? '-';
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
				tableItem.highlight = x.isPaymentOverdue;

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(isNewFilter: boolean = false) {
		if (isNewFilter) {
			this.pageIndex = 1;
		}

		const preparedFilter: any = {
			limit: isNewFilter ? 6 : this.pageSize,
			offset: isNewFilter ? 0 : this.offset,
			clientId: this.clientId,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
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

		this.tableState = TableState.Loading;

		this.saleRequestsFacade.applyFilters(preparedFilter);
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
