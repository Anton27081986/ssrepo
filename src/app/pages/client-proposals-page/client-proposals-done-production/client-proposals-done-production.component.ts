import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import { ProposalsProduction } from '@app/core/models/client-proposails/proposals-production';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientProposalsTableItem } from '@app/pages/client-proposals-page/client-proposals-info/client-proposals-table-item';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-client-proposals-done-production',
	styleUrls: ['client-proposals-done-production.component.scss'],
	templateUrl: './client-proposals-done-production.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsDoneProductionComponent {
	protected doneProductions$: Observable<{
		data: IResponse<ProposalsProduction>;
		permissions: string[];
	}>;

	constructor(
		private readonly _activatedRoute: ActivatedRoute,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this.doneProductions$ = this.clientProposalsFacadeService.doneProductions$;
	}

	protected getTableItems(production: IResponse<ProposalsProduction>): ITableItem[] {
		const productionTableItem = production.items.map(x => {
			const tableItem: IClientProposalsTableItem = {} as IClientProposalsTableItem;

			tableItem.name = x.name;
			tableItem.quantity = x.quantity;

			return tableItem;
		});

		return <ITableItem[]>(<unknown>productionTableItem);
	}
}
