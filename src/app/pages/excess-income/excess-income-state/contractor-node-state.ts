import { ExcessIncomeContractor } from '@app/core/models/excess-income/excess-income-contractors-Item';
import { BehaviorSubject, map, NEVER, switchMap, combineLatest, tap } from 'rxjs';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
export class ContractorNodeState {
	public contractor: ExcessIncomeContractor;
	public expended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public groups$: BehaviorSubject<GroupNodeState[]> = new BehaviorSubject<GroupNodeState[]>([]);

	public clientId: number;
	public limit = 20;

	constructor(
		contractor: ExcessIncomeContractor,
		clientId: number,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		this.clientId = clientId;
		this.contractor = contractor;
		combineLatest([this.expended$, this.offset$])
			.pipe(
				untilDestroyed(this),
				switchMap(([expended, offset]) => {
					if (!expended) {
						return NEVER;
					}

					return this.service.getGroup({
						limit: this.limit,
						offset: offset,
						clientId: this.clientId,
						contractorId: this.contractor.id,
						tovSubgroupsIds: this.state.filters$.value.tovGroups,
						tovIds: this.state.filters$.value.tov,
					});
				}),
				map(groups => {
					this.total$.next(groups.total);
					return [
						...this.groups$.value,
						...groups.items.map(item => {
							return new GroupNodeState(
								item,
								this.clientId,
								this.contractor.id,
								this.service,
								this.state,
							);
						}),
					];
				}),
			)
			.subscribe(this.groups$);
	}

	public pageOffsetChange($event: number) {
		this.offset$.next($event);
	}
}
