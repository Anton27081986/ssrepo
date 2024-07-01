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

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-trade-list-tab',
	templateUrl: './client-proposals-trade-list-tab.component.html',
	styleUrls: ['./client-proposals-trade-list-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsTradeListTabComponent {
	public tradeList$: Observable<IResponse<ITradeList>>;
	public pageSize = 6;
	public pageIndex = 1;
	public offset: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.tradeList$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				return this.clientProposalsFacadeService.getTradeList({
					clientId: id,
					limit: 3,
					offset,
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

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset.next(0);
		} else {
			this.offset.next(this.pageSize * $event - this.pageSize);
		}

		this.offset.next(this.pageSize * $event - this.pageSize);
		this.pageIndex = $event;
	}
}
