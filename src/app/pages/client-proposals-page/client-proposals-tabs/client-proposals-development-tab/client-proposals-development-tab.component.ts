import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';
import { IClientDevelopmentTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-table-item';
import { ClientProposalsDevelopmentTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.state';
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
	selector: 'app-client-proposals-development-tab',
	templateUrl: './client-proposals-development-tab.component.html',
	styleUrls: ['./client-proposals-development-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		ClientProposalsTabsCanvasComponent,
		NgIf,
		TextComponent,
		TableComponent,
		EmptyDataPageComponent,
		PaginationComponent,
		AsyncPipe
	],
	standalone: true
})
export class ClientProposalsDevelopmentTabComponent {
	protected developments: Signal<IResponse<IDevelopmentDto> | null> = toSignal(
		this.stateService.developments$,
		{
			initialValue: null,
		},
	);

	protected linkToModule: Signal<string | null> = computed(() => {
		const developments = this.developments();

		if (developments) {
			return developments.linkToModule;
		}

		return null;
	});

	protected total: Signal<number> = computed(() => {
		const contractors = this.developments();

		if (contractors) {
			return contractors.total;
		}

		return 0;
	});

	protected isLoader$ = this.stateService.isLoader$;

	protected pageIndex = this.stateService.pageIndex;
	protected pageSize = this.stateService.pageSize;

	constructor(private readonly stateService: ClientProposalsDevelopmentTabState) {}

	protected getTableItems(production: IResponse<IDevelopmentDto>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientDevelopmentTableItem = {} as IClientDevelopmentTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.name = x.name;
			tableItem.date = x.reportDate
				? new Date(Date.parse(x.reportDate)).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					})
				: '-';
			tableItem.status = x.status.name ?? '-';
			tableItem.sale = x.sale ?? '-';

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

	protected onIsCompletting(e: Event) {
		this.stateService.isCompleting$.next((e.currentTarget! as HTMLInputElement).checked);
		this.stateService.offset$.next(0);
		this.stateService.pageIndex = 1;
	}
}
