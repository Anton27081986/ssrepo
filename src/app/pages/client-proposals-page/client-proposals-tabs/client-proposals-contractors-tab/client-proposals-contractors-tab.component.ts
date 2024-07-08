import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, take } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsContractorsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-table-item';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-contractors-tab',
	templateUrl: './client-proposals-contractors-tab.component.html',
	styleUrls: ['./client-proposals-contractors-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsContractorsTabComponent {
	public contractors$: Observable<IResponse<IContractorsDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isArchiver$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.contractors$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				const withArchiver = this.isArchiver$.value;

				return this.clientProposalsFacadeService.getContractors({
					clientId: id,
					limit: this.pageSize,
					offset,
					withArchiver,
				});
			}),
			switchMap(item => {
				return item;
			}),
		);
	}

	protected getTableItems(production: IResponse<IContractorsDto>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsContractorsTableItem =
				{} as IClientProposalsContractorsTableItem;

			tableItem.name = {
				text: x.name.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.creditStatus = x.creditStatus.name;

			return tableItem;
		});

		return <ITableItem[]>(<unknown>productionTableItem);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset$.next(0);
		} else {
			this.offset$.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}

	protected onActiveContractorChange(e: Event) {
		this.isArchiver$.next((e.currentTarget! as HTMLInputElement).checked);
		this.offset$.next(0);
		this.pageIndex = 1;
	}
}
