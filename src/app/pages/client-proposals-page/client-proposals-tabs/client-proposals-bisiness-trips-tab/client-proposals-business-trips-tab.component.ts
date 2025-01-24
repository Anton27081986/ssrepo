import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { Currency, IResponseProposalsTrips } from '@app/core/utils/response';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { IClientProposalsBusinessTripsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-table-item';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClientProposalsBusinessTripsTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.state';
import {CardComponent} from "@app/shared/components/card/card.component";
import {
	ClientProposalsTabsCanvasComponent
} from "@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tabs-canvas/client-proposals-tabs-canvas.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";
import {NumWithSpacesPipe} from "@app/core/pipes/num-with-spaces.pipe";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-business-trips-tab',
	templateUrl: './client-proposals-business-trips-tab.component.html',
	styleUrls: ['./client-proposals-business-trips-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		ClientProposalsTabsCanvasComponent,
		NgIf,
		TextComponent,
		TableComponent,
		AsyncPipe,
		EmptyDataPageComponent,
		TooltipDirective,
		NumWithSpacesPipe,
		PaginationComponent,
		NgForOf
	],
	standalone: true
})
export class ClientProposalsBusinessTripsTabComponent {
	protected trips: Signal<IResponseProposalsTrips<IBusinessTripsDto> | null> = toSignal(
		this.clientProposalsStateService.businessTrips$,
		{
			initialValue: null,
		},
	);

	protected linkToModule: Signal<string | null> = computed(() => {
		const trips = this.trips();

		if (trips) {
			return trips.linkToModule;
		}

		return null;
	});

	protected totalClientSales: Signal<Currency | null> = computed(() => {
		const trips = this.trips();

		if (trips) {
			return trips.totalClientSales;
		}

		return null;
	});

	protected totalExpensesList: Signal<Currency[]> = computed(() => {
		const trips = this.trips();

		if (trips) {
			return trips.totalExpensesList;
		}

		return [];
	});

	protected total: Signal<number> = computed(() => {
		const trips = this.trips();

		if (trips) {
			return trips.total;
		}

		return 0;
	});

	protected isLoader$ = this.clientProposalsStateService.isLoader$;
	protected onlyCurrentYear$ = this.clientProposalsStateService.onlyCurrentYear$;

	protected pageIndex = this.clientProposalsStateService.pageIndex;
	protected pageSize = this.clientProposalsStateService.pageSize;

	constructor(
		private readonly clientProposalsStateService: ClientProposalsBusinessTripsTabState,
	) {}

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.clientProposalsStateService.offset$.next(0);
		} else {
			this.clientProposalsStateService.offset$.next(
				this.clientProposalsStateService.pageSize * $event -
					this.clientProposalsStateService.pageSize,
			);
		}

		this.clientProposalsStateService.pageIndex = $event;
	}

	protected getTableItems(production: IResponseProposalsTrips<IBusinessTripsDto>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsBusinessTripsTableItem =
				{} as IClientProposalsBusinessTripsTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.date = `${new Date(Date.parse(x.beginDate)).toLocaleString('ru-RU', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			})} - ${new Date(Date.parse(x.endDate)).toLocaleString('ru-RU', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			})}`;
			tableItem.task = x.goal ? x.goal.name : '-';
			tableItem.members = x.members?.map(c => c.name).join(', ') ?? '-';
			tableItem.expensesList =
				x.expensesList?.map(c => `${c.value} ${c.currency}`).join(', ') ?? '-';

			return tableItem;
		});

		return <ITableItem[]>(<unknown>productionTableItem);
	}

	protected onOnlyCurrentYear(e: Event) {
		this.clientProposalsStateService.onlyCurrentYear$.next(
			(e.currentTarget! as HTMLInputElement).checked,
		);
		this.clientProposalsStateService.offset$.next(0);
		this.clientProposalsStateService.pageIndex = 1;
	}

	protected readonly TooltipTheme = TooltipTheme;
}
