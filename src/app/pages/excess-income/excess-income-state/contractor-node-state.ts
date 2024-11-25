import { ExcessIncomeContractor } from '@app/core/models/excess-income/excess-income-contractors-Item';
import {
	BehaviorSubject,
	map,
	NEVER,
	switchMap,
	combineLatest,
	tap,
	debounceTime,
	scan,
} from 'rxjs';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { ExcessIncomeContractorsEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { ExcessIncomeBaseNodeState } from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';

@UntilDestroy()
export class ContractorNodeState extends ExcessIncomeBaseNodeState {
	public readonly event$: BehaviorSubject<ExcessIncomeContractorsEventEnum> =
		new BehaviorSubject<ExcessIncomeContractorsEventEnum>(
			ExcessIncomeContractorsEventEnum.excessIncomeContractorsEventDefault,
		);
	public contractor: ExcessIncomeContractor | null;
	public groups$: BehaviorSubject<GroupNodeState[]> = new BehaviorSubject<GroupNodeState[]>([]);

	public clientId: number;

	constructor(
		contractor: ExcessIncomeContractor | null,
		clientId: number,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
		private readonly isFake: boolean,
	) {
		super();
		this.clientId = clientId;
		this.contractor = contractor;
		if (isFake) {
			this.expended$.next(true);
		}

		this.expended$.pipe(untilDestroyed(this)).subscribe(value => {
			if (value) {
				this.event$.next(
					ExcessIncomeContractorsEventEnum.excessIncomeContractorsEventExpended,
				);
			}
		});

		this.paginationControl.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (val) {
						this.event$.next(
							ExcessIncomeContractorsEventEnum.excessIncomeContractorsEventChangeOffset,
						);
					}
				}),
			)
			.subscribe();

		this.event$
			.pipe(
				tap(() => this.isLoader$.next(true)),
				debounceTime(1000),
				untilDestroyed(this),
				switchMap(event => {
					if (
						event ===
						ExcessIncomeContractorsEventEnum.excessIncomeContractorsEventDefault
					) {
						return NEVER;
					}

					return this.service.getGroup({
						limit: this.limit,
						offset: this.paginationControl.value!,
						clientId: this.clientId,
						contractorId: this.contractor ? this.contractor.id : null,
						tovSubgroupsIds: this.state.filters$.value.tovGroups,
						tovIds: this.state.filters$.value.tov,
					});
				}),
				map(groups => {
					this.total$.next(groups.total);
					return groups.items.map(item => {
						return new GroupNodeState(
							item,
							this.clientId,
							this.contractor ? this.contractor.id : null,
							this.service,
							this.state,
						);
					});
				}),
				scan((acc, value) => {
					if (
						this.event$.value ===
						ExcessIncomeContractorsEventEnum.excessIncomeContractorsEventChangeOffset
					) {
						return [...acc, ...value];
					}
					return value;
				}),
			)
			.subscribe(items => {
				this.groups$.next(items);
				this.isLoader$.next(false);
			});
	}
}
