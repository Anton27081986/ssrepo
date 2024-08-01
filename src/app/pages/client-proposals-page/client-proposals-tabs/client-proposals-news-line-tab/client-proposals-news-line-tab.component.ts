import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { INewsDto } from '@app/core/models/client-proposails/news';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsNewsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-table-item';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-news-line-tab',
	templateUrl: './client-proposals-news-line-tab.component.html',
	styleUrls: ['./client-proposals-news-line-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsNewsLineTabComponent {
	protected readonly news$: Observable<IResponse<INewsDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(protected readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.news$ = combineLatest([this.clientProposalsFacadeService.clientId$, this.offset]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				return this.clientProposalsFacadeService.getNewsByClientId({
					clientId: id,
					limit: this.pageSize,
					offset,
				});
			}),
			switchMap(item => {
				return item;
			}),
		);
	}

	protected getTableItems(production: IResponse<INewsDto>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsNewsTableItem = {} as IClientProposalsNewsTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.title = x.title;
			tableItem.createDate = x.createDate
				? new Date(Date.parse(x.createDate)).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					})
				: '-';

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

		this.pageIndex = $event;
	}
}
