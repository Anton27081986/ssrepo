import { ExcessIncomeGroup } from '@app/core/models/excess-income/excess-income-group';
import { BehaviorSubject, map, NEVER, Observable, switchMap, combineLatest } from 'rxjs';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
export class GroupNodeState {
	public group: ExcessIncomeGroup;
	public tov$: BehaviorSubject<TovNodeState[]> = new BehaviorSubject<TovNodeState[]>([]);

	public expended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	public pageSize = 4;

	constructor(
		group: ExcessIncomeGroup,
		clientId: number,
		contractorId: number,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		this.state.currencyControl.valueChanges
			.pipe(filterTruthy())
			.subscribe(item => console.log(item));
		this.group = group;
		combineLatest([this.expended$, this.offset$])
			.pipe(
				untilDestroyed(this),
				switchMap(([expended, offset]) => {
					if (!expended) {
						return NEVER;
					}
					return this.service.getTov({
						limit: 10,
						offset: offset,
						clientId: clientId,
						contractorId: contractorId,
						tovSubGroupId: group.tovSubgroup.id,
						currency: this.state.currencyControl.value?.name!,
						tovsIds: this.state.filters$.value.tov,
					});
				}),
				map(res => {
					this.total$.next(res.total);
					return [
						...this.tov$.value,
						...res.items.map(item => {
							return new TovNodeState(item, service);
						}),
					];
				}),
			)
			.subscribe(this.tov$);
	}

	public pageOffsetChange($event: number) {
		this.offset$.next($event);
	}
}
