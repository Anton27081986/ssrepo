import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Signal,
} from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import { ITradeList } from '@app/core/models/client-proposails/trade-list';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { IClientProposalsTradeListTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-table-item';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { ClientProposalsTradeListTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClientProposalsTabsCanvasComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tabs-canvas/client-proposals-tabs-canvas.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { DateRangeComponent } from '@app/shared/components/inputs/date-range/date-range.component';
import { EmptyDataPageComponent } from '@app/shared/components/empty-data-page/empty-data-page.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-trade-list-tab',
	templateUrl: './client-proposals-trade-list-tab.component.html',
	styleUrls: ['./client-proposals-trade-list-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		ClientProposalsTabsCanvasComponent,
		CardComponent,
		NgIf,
		TextComponent,
		SearchInputComponent,
		DateRangeComponent,
		TableComponent,
		EmptyDataPageComponent,
		PaginationComponent,
		AsyncPipe,
	],
	standalone: true,
})
export class ClientProposalsTradeListTabComponent {
	public isFiltersVisible = false;
	protected isLoader$ = this.clientProposalsTradeListState.isLoader$;
	protected pageIndex = this.clientProposalsTradeListState.pageIndex;
	protected pageSize = this.clientProposalsTradeListState.pageSize;

	protected tradeList: Signal<IResponse<ITradeList> | null> = toSignal(
		this.clientProposalsTradeListState.tradeList$,
		{
			initialValue: null,
		},
	);

	protected linkToModule: Signal<string | null> = computed(() => {
		const tradeList = this.tradeList();

		if (tradeList) {
			return tradeList.linkToModule;
		}

		return null;
	});

	protected total: Signal<number> = computed(() => {
		const tradeList = this.tradeList();

		if (tradeList) {
			return tradeList.total;
		}

		return 0;
	});

	public filters: IFilter[] = [
		{
			name: 'TovIds',
			type: 'search',
			searchType: 'tovs',
			label: 'Товарная позиция (ТП)',
			placeholder: 'Введите ТП',
		},
		{
			name: 'DateFrom-DateTo',
			type: 'date-range',
			label: 'Дата отгрузки',
			placeholder: '',
		},
	];

	constructor(
		private readonly clientProposalsTradeListState: ClientProposalsTradeListTabState,
	) {}

	protected getTableItems(production: IResponse<ITradeList>): ITableItem[] {
		const productionTableItem = production.items.map((x) => {
			const tableItem: IClientProposalsTradeListTableItem =
				{} as IClientProposalsTradeListTableItem;

			tableItem.name = x.name;
			tableItem.amount = x.amount;
			tableItem.price = x.price;
			tableItem.currency = x.currency;
			tableItem.date = x.date
				? new Date(Date.parse(x.date)).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					})
				: '-';
			tableItem.quantity = x.quantity;

			return tableItem;
		});

		return <ITableItem[]>(<unknown>productionTableItem);
	}

	public onTovFilter(tov: any) {
		tov
			? this.clientProposalsTradeListState.TovIds$.next([tov.id])
			: this.clientProposalsTradeListState.TovIds$.next(undefined);
		this.clientProposalsTradeListState.offset$.next(0);
		this.pageIndex = 1;
	}

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.clientProposalsTradeListState.offset$.next(0);
		} else {
			this.clientProposalsTradeListState.offset$.next(
				this.pageSize * $event - this.pageSize,
			);
		}

		this.pageIndex = $event;
	}

	public onDateRangeFilter(dates: any) {
		const from =
			dates && typeof dates === 'string'
				? dates.split('-')[0].split('.')
				: undefined;

		const preparedFrom = from
			? `${[from[2], from[1], parseInt(from[0], 10)].join('-')}T00:00:00.000Z`
			: undefined;

		const to =
			dates && typeof dates === 'string'
				? dates.split('-')[1].split('.')
				: undefined;
		const preparedTo = to
			? `${[to[2], to[1], parseInt(to[0], 10)].join('-')}T23:59:59.999Z`
			: undefined;

		this.clientProposalsTradeListState.DateFrom$.next(preparedFrom);
		this.clientProposalsTradeListState.DateTo$.next(preparedTo);
		this.clientProposalsTradeListState.offset$.next(0);
		this.pageIndex = 1;
	}

	public resetForm() {
		this.clientProposalsTradeListState.TovIds$.next(undefined);
		this.clientProposalsTradeListState.DateFrom$.next(undefined);
		this.clientProposalsTradeListState.DateTo$.next(undefined);
		this.clientProposalsTradeListState.offset$.next(0);
		this.pageIndex = 1;
	}
}
