import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsBusinessTripsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-table-item';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-business-trips-tab',
	templateUrl: './client-proposals-business-trips-tab.component.html',
	styleUrls: ['./client-proposals-business-trips-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsBusinessTripsTabComponent {
	public businessTrips$: Observable<IResponse<IBusinessTripsDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public onlyCurrentYear$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.businessTrips$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				const onlyCurrentYear = this.onlyCurrentYear$.value;

				return this.clientProposalsFacadeService.getTrips({
					clientId: id,
					limit: this.pageSize,
					offset,
					onlyCurrentYear,
				});
			}),
			switchMap(item => {
				return item;
			}),
		);
	}

	protected getTableItems(production: IResponse<IBusinessTripsDto>): ITableItem[] {
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

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset.next(0);
		} else {
			this.offset.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}

	protected onOnlyCurrentYear(e: Event) {
		this.onlyCurrentYear$.next((e.currentTarget! as HTMLInputElement).checked);
		this.offset.next(0);
		this.pageIndex = 1;
	}

	protected readonly TooltipTheme = TooltipTheme;
}
