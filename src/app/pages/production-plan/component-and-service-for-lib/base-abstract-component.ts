import { Component, inject, OnInit } from '@angular/core';
import {
	BehaviorSubject,
	map,
	Observable,
	switchMap,
	combineLatest,
	tap,
} from 'rxjs';
import { IResponse } from '@app/core/utils/response';
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

	private readonly initialization$ = new BehaviorSubject<boolean>(false);

	protected items$: Observable<TValue[]> = combineLatest([
		this.headerFilterService.criteria$,
		this.offset$,
	]).pipe(
		switchMap(([value, offset]) => {
			const valueWithPagination = {
				...value,
				limit: this.limit,
				offset,
			};
			return this.loadItems(valueWithPagination as ReqParams);
		}),
		tap((value) => (this.total = value.total)),
		map((value) => value.items),
		tap((value) => console.log(value)),
	);

	public total = 0;

	abstract loadItems(criterion: ReqParams): Observable<IResponse<TValue>>;

	ngOnInit(): void {
		this.headerFilterService.init(this.filtersConfig);
		// this.headerFilterService.criteria$.subscribe((item) => {
		// 	console.log(item);
		// });
	}

	public changeOffset(offset: number): void {
		this.offset$.next(offset);
	}
}
