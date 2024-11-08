import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, switchMap, combineLatest, tap, of } from 'rxjs';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export interface ExcessIncomeCriteria {
	client: number[];
	contractors: number[];
	tovGroups: number[];
	tov: number[];
}
@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeState {
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public readonly currency$: Observable<IDictionaryItemDto[]>;
	public total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public filters$: BehaviorSubject<ExcessIncomeCriteria> =
		new BehaviorSubject<ExcessIncomeCriteria>({
			client: [],
			contractors: [],
			tovGroups: [],
			tov: [],
		});

	public currencyControl: FormControl<IDictionaryItemDto | null> = new FormControl(null);

	public clientNode$: BehaviorSubject<ClientNodeState[]> = new BehaviorSubject<ClientNodeState[]>(
		[],
	);

	public limit = 20;

	constructor(private readonly excessIncomeService: ExcessIncomeService) {
		this.currency$ = this.excessIncomeService.getCurrency().pipe(map(item => item.items));
		this.filters$.subscribe(item => console.log(item));
		combineLatest([this.offset$, this.filters$])
			.pipe(
				untilDestroyed(this),
				switchMap(([offset, filters]) => {
					return this.excessIncomeService.getClients({
						limit: this.limit,
						offset: offset,
						clientIds: filters.client,
						contractorIds: filters.contractors,
						tovSubgroupsIds: filters.tovGroups,
						tovsIds: filters.tov,
					});
				}),
				map(clients => {
					this.total$.next(clients.total);
					return [
						...this.clientNode$.value,
						...clients.items.map(
							item => new ClientNodeState(item, this.excessIncomeService, this),
						),
					];
				}),
				tap(items => console.log(items, items.length)),
			)
			.subscribe(this.clientNode$);
	}

	public applyFilters(filters: ExcessIncomeCriteria) {
		this.clientNode$.next([]);
		this.isLoader$.next(true);
		this.filters$.next(filters);
	}
}
