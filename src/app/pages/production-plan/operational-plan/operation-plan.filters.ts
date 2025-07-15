import { PlanEconomicUserFilterComponent } from '@app/pages/production-plan/operational-plan/filters/plan-economic-user/plan-economic-user-filter.component';
import { ManagerTmzFilterComponent } from '@app/pages/production-plan/operational-plan/filters/manager-tmz/managerTmz-filter.component';
import { TovFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov/tov-filter.component';
import { ProductionFactoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/production-factory/production-factory-filter.component';
import { WareHouseFilterComponent } from '@app/pages/production-plan/operational-plan/filters/ware-house/ware-house-filter.component';
import { CityFilterComponent } from '@app/pages/production-plan/operational-plan/filters/city/city-filter.component';
import { TovCategoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov-category/tov-category-filter.component';
import { SectionFilterComponent } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.component';
import { IFilterCriterionType, IFilterItem } from '@front-library/components';

export enum operationPlanFiltersFields {
	planEconomicUserIds = 'planEconomicUserIds',
	productManagerUserIds = 'ProductManagerUserIds',
	warehouseIds = 'WarehouseIds',
	productionSectionIds = 'productionSectionIds',
	tovIds = 'TovIds',
	cityIds = 'CityIds',
	tovCategoryIds = 'TovCategoryIds',
	productionFactoryIds = 'ProductionFactoryIds',
}

export const operationPlanFilter: IFilterItem[] = [
	{
		defaultValue: null,
		field: operationPlanFiltersFields.tovIds,
		text: 'Наименование ГП',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: TovFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.productionFactoryIds,
		text: 'Производство',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: ProductionFactoryFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.planEconomicUserIds,
		text: 'Менеджер ПЭО',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: PlanEconomicUserFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.productManagerUserIds,
		text: 'Менеджер ТМЗ',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: ManagerTmzFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.warehouseIds,
		text: 'Склады',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: WareHouseFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.cityIds,
		text: 'Город',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: CityFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.tovCategoryIds,
		text: 'Категория',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: TovCategoryFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: operationPlanFiltersFields.productionSectionIds,
		text: 'Участок',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => +v),
		},
		valueComponent: SectionFilterComponent,
		active: false,
	},
];
