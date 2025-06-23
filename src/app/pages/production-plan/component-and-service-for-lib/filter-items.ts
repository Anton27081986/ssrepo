import { ComponentType } from '@angular/cdk/overlay';

export interface IFilterItem {
	readonly field: string; // fill from another enum
	readonly text: string;
	readonly queryParamConfig: FilterItemQueryParamConfig<IFilterCriterionType> | null;
	readonly defaultValue: IFilterCriterionType | null;
	readonly valueComponent: ComponentType<unknown>;
	active: boolean;
}

export interface FilterItemQueryParamConfig<T extends IFilterCriterionType> {
	readonly mapTo: (value: T) => string;
	readonly mapFrom: (value: string[]) => T;
}

export type IFilterCriterionType = number[] | null;

export interface IFilterCriteria {
	field: string;
	value: IFilterCriterionType;
}

export interface FilterQueryParams {
	[name: string]: string | string[];
}

export type DynamicNumberArrayObject = {
	[key: string]: IFilterCriterionType;
};
