import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ITradeList } from '@app/core/models/client-proposails/trade-list';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsTradeListTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-table-item';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { ClientProposalsTabBase } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tab-base';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-trade-list-tab',
	templateUrl: './client-proposals-trade-list-tab.component.html',
	styleUrls: ['./client-proposals-trade-list-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsTradeListTabComponent extends ClientProposalsTabBase {
	public tradeList$: Observable<IResponse<ITradeList>>;
	public isFiltersVisible: boolean = false;

	public TovIds$: BehaviorSubject<number[] | undefined> = new BehaviorSubject<
		number[] | undefined
	>(undefined);

	public DateFrom$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(
		undefined,
	);

	public DateTo$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(
		undefined,
	);

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

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		super();
		this.tradeList$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				const TovIds = this.TovIds$.value;
				const DateFrom = this.DateFrom$.value;
				const DateTo = this.DateTo$.value;

				return this.clientProposalsFacadeService.getTradeList({
					clientId: id,
					limit: this.pageSize,
					offset,
					TovIds,
					DateFrom,
					DateTo,
				});
			}),
			switchMap(item => {
				return item;
			}),
		);
	}

	protected getTableItems(production: IResponse<ITradeList>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
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
		tov ? this.TovIds$.next([tov.id]) : this.TovIds$.next(undefined);
		this.offset$.next(0);
		this.pageIndex = 1;
	}

	public onDateRangeFilter(dates: any) {
		const from =
			dates && typeof dates === 'string' ? dates.split('-')[0].split('.') : undefined;

		const preparedFrom = from
			? `${[from[2], from[1], parseInt(from[0], 10)].join('-')}T00:00:00.000Z`
			: undefined;

		const to = dates && typeof dates === 'string' ? dates.split('-')[1].split('.') : undefined;
		const preparedTo = to
			? `${[to[2], to[1], parseInt(to[0], 10)].join('-')}T23:59:59.999Z`
			: undefined;

		this.DateFrom$.next(preparedFrom);
		this.DateTo$.next(preparedTo);
		this.offset$.next(0);
		this.pageIndex = 1;
	}

	public resetForm() {
		this.TovIds$.next(undefined);
		this.DateFrom$.next(undefined);
		this.DateTo$.next(undefined);
		this.offset$.next(0);
		this.pageIndex = 1;
	}
}
