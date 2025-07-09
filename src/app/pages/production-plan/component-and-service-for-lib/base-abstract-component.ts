import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap, scan } from 'rxjs';
import { IResponse, ProductionPlanResponse } from '@app/core/utils/response';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { IFilterItem } from '@app/pages/production-plan/component-and-service-for-lib/filter-items';

@Component({ template: '' })
export abstract class BaseAbstractComponent<TValue, ReqParams>
	implements OnInit
{
	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	protected filtersConfig: IFilterItem[] = [];
	public limit = 20;

	public offset$ = new BehaviorSubject<number>(0);
	public itemTotal$ = new BehaviorSubject<number>(0);

	public total = 0;

	protected items$: Observable<TValue[]> = this.offset$.pipe(
		switchMap((offset) =>
			this.headerFilterService.criteria$.pipe(
				switchMap((criteria) => {
					const valueWithPagination = {
						...criteria,
						limit: this.limit,
						offset,
					};
					return this.loadItems(valueWithPagination as ReqParams);
				}),
			),
		),

		tap((value) => {
			this.total = value.total;
		}),

		map((value) => value.items),

		scan((acc, value) => {
			if (this.offset$.value === 0) {
				return value;
			}

			return [...acc, ...value];
		}, [] as TValue[]),

		tap((value) => this.itemTotal$.next(value.length)),
	);

	abstract loadItems(
		criterion: ReqParams,
	): Observable<ProductionPlanResponse<TValue>>;

	ngOnInit(): void {
		this.headerFilterService.init(this.filtersConfig);

		this.headerFilterService.criteria$
			// .pipe(
			// 	distinctUntilChanged(
			// 		(a, b) => JSON.stringify(a) === JSON.stringify(b),
			// 	),
			// )
			.subscribe(() => {
				if (this.offset$.value !== 0) {
					this.offset$.next(0);
				}
			});
	}

	public changeOffset(offset: number): void {
		this.offset$.next(offset);
	}
}
