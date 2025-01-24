import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import {FiltersComponent, IFilter} from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { IReturnRequestsTableItem } from '@app/pages/client-card/client-card-return-requests/return-requests-table-item';
import { ReturnRequestsFacadeService } from '@app/core/facades/return-requests-facade.service';
import { IReturnRequestsItemDto } from '@app/core/models/company/return-requests-item-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Observable } from 'rxjs';
import {CardComponent} from "@app/shared/components/card/card.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'app-client-card-return-requests',
	templateUrl: './client-card-return-requests.component.html',
	styleUrls: ['./client-card-return-requests.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		LoaderComponent,
		NgIf,
		HeadlineComponent,
		AsyncPipe,
		IconComponent,
		TableComponent,
		NzPaginationComponent,
		EmptyPlaceholderComponent,
		TextComponent,
		FiltersComponent
	],
	standalone: true
})
export class ClientCardReturnRequestsComponent implements OnInit {
	public requests$: Observable<IReturnRequestsItemDto | null>;

	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IReturnRequestsTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible: boolean = false;
	public tableState: TableState = TableState.Loading;

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
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
		this.requests$ = this.returnRequestsFacadeService.requests$;
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.returnRequestsFacadeService.requests$
			.pipe(untilDestroyed(this))
			.subscribe(response => {
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

	private mapClientsToTableItems(sales: IReturnRequestsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: IReturnRequestsTableItem = {} as IReturnRequestsTableItem;

				tableItem.code = {
					text: x.id.toString() ?? '-',
					url: x.detailLink ?? '',
				};
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
				tableItem.tov = x.tov.map(t => t.name).join(', ') ?? '-';

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

		this.returnRequestsFacadeService.applyFilters(preparedFilter);
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
