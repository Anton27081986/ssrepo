import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { IResponse, IResponseProposalsTrips } from '@app/core/utils/response';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsContractorsTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-table-item';
import { ClientProposalsContractorsTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.state';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-contractors-tab',
	templateUrl: './client-proposals-contractors-tab.component.html',
	styleUrls: ['./client-proposals-contractors-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsContractorsTabComponent {
	protected contractors: Signal<IResponse<IContractorsDto> | null> = toSignal(
		this.stateService.contractors$,
		{
			initialValue: null,
		},
	);

	protected linkToModule: Signal<string | null> = computed(() => {
		const contractors = this.contractors();
		if (contractors) {
			return contractors.linkToModule;
		}

		return null;
	});

	protected total: Signal<number> = computed(() => {
		const contractors = this.contractors();
		if (contractors) {
			return contractors.total;
		}

		return 0;
	});

	protected isLoader$ = this.stateService.isLoader$;

	protected pageIndex = this.stateService.pageIndex;
	protected pageSize = this.stateService.pageSize;

	constructor(private readonly stateService: ClientProposalsContractorsTabState) {}

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

	protected onActiveContractorChange(e: Event) {
		this.stateService.isArchiver$.next((e.currentTarget! as HTMLInputElement).checked);
		this.stateService.offset$.next(0);
		this.stateService.pageIndex = 1;
	}
}
