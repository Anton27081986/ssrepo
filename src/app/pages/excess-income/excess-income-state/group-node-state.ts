import { ExcessIncomeGroup, IdName } from '@app/core/models/excess-income/excess-income-group';
import { BehaviorSubject, debounceTime, map, NEVER, scan, switchMap, tap } from 'rxjs';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeGroupEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { ExcessIncomeBaseNodeState } from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';

@UntilDestroy()
export class GroupNodeState extends ExcessIncomeBaseNodeState {
	readonly event$: BehaviorSubject<ExcessIncomeGroupEventEnum> =
		new BehaviorSubject<ExcessIncomeGroupEventEnum>(
			ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault,
		);

	public group: ExcessIncomeGroup;

	public tov$: BehaviorSubject<TovNodeState[]> = new BehaviorSubject<TovNodeState[]>([]);

	constructor(
		group: ExcessIncomeGroup,
		clientId: number,
		contractorId: number | null,
		private readonly service: ExcessIncomeService,
		private readonly state: ExcessIncomeState,
	) {
		super();
		this.group = group;

		this.state.currencyControl.valueChanges.pipe(filterTruthy()).subscribe(value => {
			this.event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency);
		});

		this.paginationControl.valueChanges
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (val) {
						this.event$.next(
							ExcessIncomeGroupEventEnum.excessIncomeGroupEventChangeOffset,
						);
					}
				}),
			)
			.subscribe();
		this.expended$
			.pipe(
				untilDestroyed(this),
				tap(val => {
					if (val) {
						this.event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupEventExpended);
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
					if (event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventDefault) {
						return NEVER;
					}

					if (
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate ||
						event === ExcessIncomeGroupEventEnum.excessIncomeGroupChangeCurrency
					) {
						if (!this.expended$.value) {
							return NEVER;
						}

						this.paginationControl.setValue(0, { emitEvent: false });
					}

					return this.getTov(clientId, contractorId);
				}),
				map(res => {
					this.total$.next(res.total);
					return res.items.map(item => {
						return new TovNodeState(
							item,
							service,
							state,
							this.state.currencyControl.value!,
						);
					});
				}),
				scan((acc, value) => {
					if (
						this.event$.value ===
						ExcessIncomeGroupEventEnum.excessIncomeGroupEventChangeOffset
					) {
						return [...acc, ...value];
					}
					return value;
				}),
			)
			.subscribe(items => {
				this.tov$.next(items);
				this.isLoader$.next(false);
			});
	}

	private getTov(clientId: number, contractorId: number | null) {
		return this.service.getTov({
			limit: 10,
			offset: this.paginationControl.value!,
			clientId: clientId,
			contractorId: contractorId,
			tovSubGroupId: this.group.tovSubgroup.id,
			currencyId: this.state.currencyControl.value?.id!,
			tovsIds: this.state.filters$.value.tov,
		});
	}
}
