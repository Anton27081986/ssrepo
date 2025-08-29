import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import {
	FiltersComponent,
	IFilter,
} from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { INewProductsTableItem } from './new-products-table-item';
import { NewProductsFacadeService } from '@app/core/facades/new-products-facade.service';
import { INewProductsItemDto } from '@app/core/models/company/new-products-item-dto';
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
	selector: 'app-client-card-new-products',
	templateUrl: './client-card-new-products.component.html',
	styleUrls: ['./client-card-new-products.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		LoaderComponent,
		NgIf,
		HeadlineComponent,
		IconComponent,
		AsyncPipe,
		TableComponent,
		EmptyPlaceholderComponent,
		TextComponent,
		FiltersComponent,
		PaginationComponent,
	],
	standalone: true,
})
export class ClientCardNewProductsComponent implements OnInit {
	public newProducts$: Observable<INewProductsItemDto | null>;

	// table
	public total = 0;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: INewProductsTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible = false;
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

	protected readonly TableState = TableState;
	constructor(
		public readonly newProductsFacadeService: NewProductsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService
	) {
		this.newProducts$ = this.newProductsFacadeService.newProducts$;
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.newProductsFacadeService.newProducts$
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

	private mapClientsToTableItems(sales: INewProductsItemDto) {
		return (
			sales.items?.map((x) => {
				const tableItem: INewProductsTableItem =
					{} as INewProductsTableItem;

				tableItem.code = {
					text: x.id.toString() ?? '-',
					url: x.detailLink ?? '',
				};
				tableItem.status = x.status.name ?? '-';
				tableItem.productName = x.productName ?? '-';
				tableItem.customer =
					x.customers?.map((c) => c.name).join(', ') ?? '-';
				tableItem.developer = x.developer?.name ?? '-';

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
			СlientId: this.clientId,
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
}
