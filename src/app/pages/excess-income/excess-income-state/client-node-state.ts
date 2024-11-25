import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { BehaviorSubject, map, NEVER, Observable, tap } from 'rxjs';
import { ContractorNodeState } from '@app/pages/excess-income/excess-income-state/contractor-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExcessIncomeBaseNodeState } from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';
@UntilDestroy()
export class ClientNodeState extends ExcessIncomeBaseNodeState {
	public client: ExcessIncomeClient;
	public contractors$: Observable<ContractorNodeState[]>;

	constructor(
		client: ExcessIncomeClient,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		super();
		this.client = client;
		this.contractors$ = this.expended$.pipe(
			map(val => {
				if (!val) {
					NEVER;
				}
				if (client.contractors.length) {
					return client.contractors.map(
						contractor =>
							new ContractorNodeState(
								contractor,
								client.id,
								this.service,
								state,
								false,
							),
					);
				}
				return [new ContractorNodeState(null, client.id, this.service, state, true)];
			}),
		);
	}
}
