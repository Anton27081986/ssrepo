import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import { ITableItem } from '@app/shared/components/table/table.component';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';
import { IClientDevelopmentTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-table-item';
import { ClientProposalsTabBase } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tab-base';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-development-tab',
	templateUrl: './client-proposals-development-tab.component.html',
	styleUrls: ['./client-proposals-development-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsDevelopmentTabComponent extends ClientProposalsTabBase {
	public developments$: Observable<IResponse<IDevelopmentDto>>;
	public isCompleting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		super();
		this.developments$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				const isCompleting = this.isCompleting$.value;

				return this.clientProposalsFacadeService.getDevelopment({
					clientId: id,
					limit: this.pageSize,
					offset,
					isCompleting,
				});
			}),
			switchMap(item => {
				return item;
			}),
		);
	}

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

	protected onIsCompletting(e: Event) {
		this.isCompleting$.next((e.currentTarget! as HTMLInputElement).checked);
		this.offset$.next(0);
		this.pageIndex = 1;
	}
}
