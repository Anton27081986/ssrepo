import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import { INewsDto } from '@app/core/models/client-proposails/news';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { IClientProposalsNewsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-table-item';
import { ClientProposalsNewsLineTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.state';
import { toSignal } from '@angular/core/rxjs-interop';
import {CardComponent} from "@app/shared/components/card/card.component";
import {
	ClientProposalsTabsCanvasComponent
} from "@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tabs-canvas/client-proposals-tabs-canvas.component";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-news-line-tab',
	templateUrl: './client-proposals-news-line-tab.component.html',
	styleUrls: ['./client-proposals-news-line-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		ClientProposalsTabsCanvasComponent,
		NgIf,
		TextComponent,
		TableComponent,
		AsyncPipe,
		EmptyDataPageComponent,
		PaginationComponent
	],
	standalone: true
})
export class ClientProposalsNewsLineTabComponent {
	protected news: Signal<IResponse<INewsDto> | null> = toSignal(this.stateService.news$, {
		initialValue: null,
	});

	protected linkToModule: Signal<string | null> = computed(() => {
		const news = this.news();

		if (news) {
			return news.linkToModule;
		}

		return null;
	});

	protected total: Signal<number> = computed(() => {
		const news = this.news();

		if (news) {
			return news.total;
		}

		return 0;
	});

	protected isLoader$ = this.stateService.isLoader$;

	protected pageIndex = this.stateService.pageIndex;
	protected pageSize = this.stateService.pageSize;

	constructor(protected readonly stateService: ClientProposalsNewsLineTabState) {}

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

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.stateService.offset$.next(0);
		} else {
			this.stateService.offset$.next(
				this.stateService.pageSize * $event - this.stateService.pageSize,
			);
		}

		this.stateService.pageIndex = $event;
	}
}
