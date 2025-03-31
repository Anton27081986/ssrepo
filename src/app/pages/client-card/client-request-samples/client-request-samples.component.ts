import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { ISamplesTableItem } from '@app/pages/client-card/client-request-samples/samples-table-item';
import { TableState } from '@app/shared/components/table/table-state';
import {
	FiltersComponent,
	IFilter,
} from '@app/shared/components/filters/filters.component';
import { RequestSamplesFacadeService } from '@app/core/facades/request-samples-facade.service';
import { ISampleItemDto } from '@app/core/models/company/sample-item-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Observable } from 'rxjs';
import { CardComponent } from '@app/shared/components/card/card.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'ss-client-request-samples',
	templateUrl: './client-request-samples.component.html',
	styleUrls: ['./client-request-samples.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		LoaderComponent,
		NgIf,
		HeadlineComponent,
		AsyncPipe,
		IconComponent,
		TableComponent,
		EmptyPlaceholderComponent,
		TextComponent,
		FiltersComponent,
		PaginationComponent,
	],
	standalone: true,
})
export class ClientRequestSamplesComponent implements OnInit {
	public samples$: Observable<ISampleItemDto | null>;

	// table
	public total = 0;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: ISamplesTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible = false;
	public tableState: TableState = TableState.Empty;

	public filters: IFilter[] = [
		{
			name: 'managerId',
			type: 'search',
			searchType: 'user',
			label: 'Менеджер',
			placeholder: 'Введите ФИО',
		},
		{
			name: 'TovId',
			type: 'search',
			searchType: 'tovs',
			label: 'Товарная позиция (ТП)',
			placeholder: 'Введите ТП',
		},
	];

	protected readonly TableState = TableState;
	constructor(
		public readonly requestSamplesFacade: RequestSamplesFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
		this.samples$ = this.requestSamplesFacade.samples$;
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.requestSamplesFacade.samples$
			.pipe(untilDestroyed(this))
			.subscribe((response) => {
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

		this.clientCardListFacade.client$
			.pipe(untilDestroyed(this))
			.subscribe((client) => {
				if (client.id) {
					this.clientId = client.id;
					this.getFilteredSales();
				}
			});
	}

	private mapClientsToTableItems(sales: ISampleItemDto) {
		return (
			sales.items?.map((x) => {
				const tableItem: ISamplesTableItem = {} as ISamplesTableItem;

				tableItem.code = {
					text: x.id.toString() ?? '-',
					url: x.detailLink ?? '',
				};
				tableItem.status = x.status.name ?? '-';
				tableItem.orderDate = x.orderDate
					? new Date(Date.parse(x.orderDate)).toLocaleString(
							'ru-RU',
							{
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
							},
						)
					: '-';
				tableItem.managerName = x.manager.name ?? '-';
				tableItem.tovName = x.tov.name ?? '-';
				tableItem.planQuantity = x.planQuantity.toString() ?? '-';
				tableItem.factQuantity = x.factQuantity?.toString() ?? '-';
				tableItem.planWeight = x.planWeight.toString() ?? '-';
				tableItem.factWeight = x.factWeight?.toString() ?? '-';
				tableItem.comment = x.comment ?? '-';

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
			preparedFilter[filter.name] =
				filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'select':
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map((item) => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] =
						filter.value === 'Да' ? true : null;
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

		this.requestSamplesFacade.applyFilters(preparedFilter);
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
}
