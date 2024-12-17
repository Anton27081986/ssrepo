import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, map, Observable, scan, switchMap, tap } from 'rxjs';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { FormControl } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { IResponse } from '@app/core/utils/response';
import { ExcessIncomeEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';

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
	readonly event$: BehaviorSubject<ExcessIncomeEventEnum> =
		new BehaviorSubject<ExcessIncomeEventEnum>(ExcessIncomeEventEnum.excessIncomeDefault);

	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public dropDownVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public readonly currency$: Observable<IDictionaryItemDto[]>;

	public readonly total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	public readonly filters$: BehaviorSubject<ExcessIncomeCriteria> =
		new BehaviorSubject<ExcessIncomeCriteria>({
			client: [],
			contractors: [],
			tovGroups: [],
			tov: [],
		});

	public readonly currencyControl: FormControl<IDictionaryItemDto | null> = new FormControl(null);

	public readonly paginationControl: FormControl<number | null> = new FormControl<number>(0);

	public clientNode$: Observable<ClientNodeState[]>;

	public limit = 20;

	constructor(private readonly excessIncomeService: ExcessIncomeService) {
		this.currency$ = this.excessIncomeService.getCurrency().pipe(map(item => item.items));

		this.paginationControl.valueChanges.subscribe(value => {
			this.event$.next(ExcessIncomeEventEnum.excessIncomeChangeOffset);
		});

		this.clientNode$ = this.event$.pipe(
			tap(() => {
				this.dropDownVisible$.next(false);
				this.isLoader$.next(true);
			}),
			debounceTime(2000),
			switchMap(event => {
				if (
					event === ExcessIncomeEventEnum.excessIncomeClientUpdated ||
					event === ExcessIncomeEventEnum.excessIncomeChangeFilter
				) {
					this.paginationControl.setValue(0, { emitEvent: false });
				}

				return this.getClients(this.filters$.value, this.paginationControl.value!).pipe(
					map(res => {
						this.total$.next(res.total);

						return res.items;
					}),
				);
			}),
			map(clients => {
				return clients.map(
					item => new ClientNodeState(item, this.excessIncomeService, this),
				);
			}),
			scan((acc, value) => {
				if (this.event$.value === ExcessIncomeEventEnum.excessIncomeChangeOffset) {
					return [...acc, ...value];
				}

				return value;
			}),
			tap(() => {
				this.isLoader$.next(false);
				this.dropDownVisible$.next(true);
			}),
		);
	}

	private getClients(
		filters: ExcessIncomeCriteria,
		offset: number,
	): Observable<IResponse<ExcessIncomeClient>> {
		return this.excessIncomeService.getClients({
			limit: this.limit,
			offset,
			clientIds: filters.client,
			contractorIds: filters.contractors,
			tovSubgroupsIds: filters.tovGroups,
			tovsIds: filters.tov,
		});
	}

	public clearFilters() {
		this.filters$.next({
			client: [],
			contractors: [],
			tovGroups: [],
			tov: [],
		});

		this.event$.next(ExcessIncomeEventEnum.excessIncomeChangeFilter);
	}

	public applyFilters(filters: ExcessIncomeCriteria) {
		this.filters$.next({
			client: filters.client,
			contractors: filters.contractors,
			tovGroups: filters.tovGroups,
			tov: filters.tov,
		});

		this.event$.next(ExcessIncomeEventEnum.excessIncomeChangeFilter);
	}
}
