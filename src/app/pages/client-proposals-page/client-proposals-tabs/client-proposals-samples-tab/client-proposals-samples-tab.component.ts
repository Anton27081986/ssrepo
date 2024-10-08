import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { IResponse, IResponseProposalsTrips } from '@app/core/utils/response';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsSamplesTableItem } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-table-item';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { ClientProposalsSamplesTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.state';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-samples-tab',
	templateUrl: './client-proposals-samples-tab.component.html',
	styleUrls: ['./client-proposals-samples-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsSamplesTabComponent {
	protected samples: Signal<IResponseProposalsTrips<ISamples> | null> = toSignal(
		this.stateService.samples$,
		{
			initialValue: null,
		},
	);

	protected linkToModule: Signal<string | null> = computed(() => {
		const samples = this.samples();
		if (samples) {
			return samples.linkToModule;
		}

		return null;
	});

	protected total: Signal<number> = computed(() => {
		const samples = this.samples();
		if (samples) {
			return samples.total;
		}

		return 0;
	});

	protected totalSales: Signal<number | null> = computed(() => {
		const samples = this.samples();
		if (samples) {
			return samples.totalSales;
		}

		return null;
	});

	protected pageIndex = this.stateService.pageIndex;
	protected pageSize = this.stateService.pageSize;

	protected isLoader$ = this.stateService.isLoader$;

	constructor(private readonly stateService: ClientProposalsSamplesTabState) {}

	protected getTableItems(production: IResponse<ISamples>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsSamplesTableItem =
				{} as IClientProposalsSamplesTableItem;

			const pipeNumWithSpaces = new NumWithSpacesPipe();

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.linkToDetail ?? '',
			};
			tableItem.weight = x.weight ?? 0;
			tableItem.quantity = x.quantity ?? 0;
			tableItem.tov = x.tov.name ?? '-';
			tableItem.price = x.price ? pipeNumWithSpaces.numberWithSpaces(x.price, 2) : '-';
			tableItem.sales = x.sales ?? '-';

			return tableItem;
		});

		return <ITableItem[]>(<unknown>productionTableItem);
	}

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.stateService.offset$.next(0);
		} else {
			this.stateService.offset$.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}
}
