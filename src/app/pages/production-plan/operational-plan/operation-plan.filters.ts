import {
	IFilterCriterionType,
	IFilterItem,
} from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
import { PlanEconomicUserFilterComponent } from '@app/pages/production-plan/operational-plan/filters/plan-economic-user/plan-economic-user-filter.component';
import { ManagerTmzFilterComponent } from '@app/pages/production-plan/operational-plan/filters/manager-tmz/managerTmz-filter.component';
import { TovFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov/tov-filter.component';
import { ProductionFactoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/production-factory/production-factory-filter.component';
import { WareHouseFilterComponent } from '@app/pages/production-plan/operational-plan/filters/ware-house/ware-house-filter.component';
import { CityFilterComponent } from '@app/pages/production-plan/operational-plan/filters/city/city-filter.component';
import { TovCategoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov-category/tov-category-filter.component';
import { SectionFilterComponent } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.component';

export enum operationPlanFiltersFields {
	planEconomicUserId = 'planEconomicUserId',
	productManagerUserId = 'ProductManagerUserId',
	warehouseId = 'WarehouseId',
	productionSectionId = 'ProductionSectionId',
	tovId = 'TovId',
	cityId = 'CityId',
	tovCategoryId = 'TovCategoryId',
	productionFactoryId = 'ProductionFactoryId',
}

export const operationPlanFilter: IFilterItem[] = [
	{
		defaultValue: null,
		field: operationPlanFiltersFields.tovId,
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
		field: operationPlanFiltersFields.productionFactoryId,
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
		field: operationPlanFiltersFields.planEconomicUserId,
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
		field: operationPlanFiltersFields.productManagerUserId,
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
		field: operationPlanFiltersFields.warehouseId,
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
		field: operationPlanFiltersFields.cityId,
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
		field: operationPlanFiltersFields.tovCategoryId,
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
		field: operationPlanFiltersFields.productionSectionId,
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
