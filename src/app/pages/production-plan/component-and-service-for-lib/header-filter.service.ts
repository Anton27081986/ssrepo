import { Injectable } from '@angular/core';
import {
	DynamicNumberArrayObject,
	FilterQueryParams,
	IFilterCriteria,
	IFilterCriterionType,
	IFilterItem,
} from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
import {
	Observable,
	map,
	BehaviorSubject,
	throttleTime,
	asyncScheduler,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HeaderFilterService {
	public readonly filterChanges$: BehaviorSubject<IFilterCriteria[]> =
		new BehaviorSubject<IFilterCriteria[]>([]);
	public filterItems: IFilterItem[] = [];
	public filters: IFilterCriteria[] = [];
	public menuFilterItems: IFilterItem[] = [];

	public readonly criteria$: Observable<DynamicNumberArrayObject>;

	constructor(
		private _router: Router,
		private readonly _activatedRoute: ActivatedRoute,
	) {
		this.criteria$ = this.filterChanges$.pipe(
			throttleTime(200, asyncScheduler, {
				leading: false,
				trailing: true,
			}),
			map((value) => {
				return this.mapCriteriaToObject(value);
			}),
		);
	}

	public init(filters: IFilterItem[]): void {
		this.filterItems = filters;
		this.setFilters();
		this.setValuesFromQueryParams();
		this.setMenuFilterItems();
		this.filterChanges$.next(this.filters);
	}

	public setFilters(): void {
		this.filters = this.filterItems.map((item) => {
			return {
				field: item.field,
				value: null,
			};
		});
	}

	public setValueItemFilter(value: IFilterCriterionType, field: string) {
		const checkFil = this.getFilter(field);
		if (checkFil.value !== value) {
			checkFil.value = value;
			this.setQueryParamsFromFilter();
			this.filterChanges$.next(this.filters);
		}
	}

	public mapCriteriaToObject(
		criteria: IFilterCriteria[],
	): Record<string, IFilterCriterionType> {
		return criteria.reduce((acc, criterion) => {
			acc[criterion.field] = criterion.value;
			return acc;
		}, {} as DynamicNumberArrayObject);
	}

	private setMenuFilterItems(): void {
		this.filters.forEach((filter) => {
			if (filter.value) {
				const filterItem = this.getFilterItem(filter.field);
				filterItem.active = true;
				this.menuFilterItems.push(filterItem);
			}
		});
	}

	private setValuesFromQueryParams(): void {
		const queryParams = this.getGlobalQueryParams();
		const filters = this.filters;
		this.filterItems.forEach((item) => {
			const configKey = 'queryParamConfig';
			const itemField = item.field;
			if (
				configKey in item &&
				itemField in queryParams &&
				item[configKey] !== null &&
				queryParams[itemField] !== null
			) {
				const rawValue = queryParams[itemField] as string | string[];
				const vals = Array.isArray(rawValue)
					? rawValue
					: rawValue.split(',');
				const value = item[configKey].mapFrom(vals);

				if (Array.isArray(value)) {
					if (value.length > 0) {
						this.getFilter(item.field).value = value;
					}
				}
			}
		});
		this.filters = filters;
	}

	public setQueryParamsFromFilter(): void {
		const queryParams: FilterQueryParams = {};
		this.filters.forEach((item) => {
			const filterItem = this.getFilterItem(item.field);
			if (filterItem?.queryParamConfig) {
				const val = filterItem.queryParamConfig.mapTo(item.value);
				if (val === '') {
					delete queryParams[filterItem.field];
					return;
				}
				let acc = queryParams[filterItem.field];
				if (acc === undefined || acc === null) {
					acc = val;
				} else {
					if (!Array.isArray(acc)) {
						acc = [acc];
					}
					acc.push(val);
				}
				queryParams[filterItem.field] = acc;
			}
		});
		this.setGlobalQueryParams(queryParams).then();
	}

	private checkForNotEmptyArrayOrNull(value: IFilterCriterionType): boolean {
		return (Array.isArray(value) && value.length > 0) || value === null;
	}

	public setGlobalQueryParams(params: FilterQueryParams): Promise<boolean> {
		return this._router.navigate([], {
			queryParams: params,
		});
	}

	public getGlobalQueryParams(): FilterQueryParams {
		if (this._activatedRoute.snapshot.queryParams !== undefined) {
			return { ...this._activatedRoute.snapshot.queryParams };
		}
		return {};
	}

	public getFilterItem(field: string): IFilterItem {
		return this.filterItems.filter((item) => item.field === field)[0];
	}

	public getFilter(field: string): IFilterCriteria {
		return this.filters.filter((item) => item.field === field)[0];
	}

	public addFilterMenu(filter: IFilterItem): void {
		this.menuFilterItems.push(filter);
	}

	public removeFilterMenu(filter: IFilterItem): void {
		this.menuFilterItems = this.menuFilterItems.filter(
			(item) => item.active,
		);
		const findFil = this.getFilter(filter.field); // если в старом было значение то обновляем если не было то нет
		if (findFil.value !== null) {
			findFil.value = null;

			this.filterChanges$.next(this.filters);
			this.setQueryParamsFromFilter();
		}
	}
}
