import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { IFilterItem } from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ template: '' })
export abstract class BaseAbstractComponent<TValue, ReqParams>
	implements OnInit
{
	private headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	protected filtersConfig: IFilterItem[] = [];
	public offset: number = 0;

	private offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	// private initialization$: BehaviorSubject<boolean> =
	// 	new BehaviorSubject<boolean>(false);

	// private items: Signal<TValue[]> = toSignal(
	// 	this.headerFilterService.criteria$.pipe(
	// 		switchMap((value) => {
	// 			console.log(value);
	// 			return this.loadItems(value as ReqParams);
	// 		}),
	// 		map((value) => value.items),
	// 	),
	// 	{ initialValue: [] },
	// );

	public total: number = 0;

	abstract loadItems(criterion: ReqParams): Observable<IResponse<TValue>>;

	ngOnInit() {
		this.headerFilterService.init(this.filtersConfig);
		this.headerFilterService.criteria$.subscribe((item) => {
			console.log(item);
		});
	}

	public changeOffset(offset: number) {
		this.offset$.next(offset);
		return offset;
	}
}
