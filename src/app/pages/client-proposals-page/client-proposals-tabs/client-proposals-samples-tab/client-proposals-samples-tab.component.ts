import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsSamplesTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-table-item';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-samples-tab',
	templateUrl: './client-proposals-samples-tab.component.html',
	styleUrls: ['./client-proposals-samples-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsSamplesTabComponent {
	public readonly samples$: Observable<IResponse<ISamples>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(private readonly facadeService: ClientProposalsFacadeService) {
		this.samples$ = combineLatest([this.facadeService.clientId$, this.offset]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				return this.facadeService.getExamplesByClientId({
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

	protected getTableItems(production: IResponse<ISamples>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsSamplesTableItem =
				{} as IClientProposalsSamplesTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.weight = x.weight;
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

		this.pageIndex = $event;
	}
}
