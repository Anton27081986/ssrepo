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

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-development-tab',
	templateUrl: './client-proposals-development-tab.component.html',
	styleUrls: ['./client-proposals-development-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsDevelopmentTabComponent {
	public developments$: Observable<IResponse<IDevelopmentDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.developments$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				return this.clientProposalsFacadeService.getDevelopment({
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
