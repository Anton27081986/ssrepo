import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { TableState } from '@app/shared/components/table/table-state';
import { ILostProductsTableItem } from '@app/pages/client-card/client-card-lost-products/lost-products-table-item';
import { ILostProductsFilter } from '@app/core/models/lost-products-filter';
import { LostProductsFacadeService } from '@app/core/facades/lost-products-facade.service';
import { ILostProductsItemDto } from '@app/core/models/company/lost-products-item-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-card-lost-products',
	templateUrl: './client-card-lost-products.component.html',
	styleUrls: ['./client-card-lost-products.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardLostProductsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: ILostProductsTableItem[] = [];

	// state
	public isFiltersVisible: boolean = false;
	public tableState: TableState = TableState.Loading;
	public filter: ILostProductsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [];

	public constructor(
		public readonly lostProductsFacadeService: LostProductsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.lostProductsFacadeService.lostProducts$
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
				this.filter.clientId = client.id;
				this.lostProductsFacadeService.applyFilters(this.filter);
			}
		});
	}

	private mapClientsToTableItems(sales: ILostProductsItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: ILostProductsTableItem = {} as ILostProductsTableItem;

				tableItem.tov = x.tov.toString() ?? '-';
				tableItem.fixationDate = x.fixationDate
					? new Date(Date.parse(x.fixationDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.shipDate = x.shipDate
					? new Date(Date.parse(x.shipDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.quantity = x.quantity ?? '-';
				tableItem.valueEff = x.valueEff ?? '-';
				tableItem.requestName = x.requestName ?? '-';
				tableItem.requestLink = x.requestLink ?? '-';

				return tableItem;
			}) || []
		);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.lostProductsFacadeService.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
