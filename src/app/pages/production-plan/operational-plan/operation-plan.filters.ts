import { PlanEconomicUserFilterComponent } from '@app/pages/production-plan/operational-plan/filters/plan-economic-user/plan-economic-user-filter.component';
import { ManagerTmzFilterComponent } from '@app/pages/production-plan/operational-plan/filters/manager-tmz/manager-tmz-filter.component';
import { TovFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov/tov-filter.component';
import { ProductionFactoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/production-factory/production-factory-filter.component';
import { WareHouseFilterComponent } from '@app/pages/production-plan/operational-plan/filters/ware-house/ware-house-filter.component';
import { CityFilterComponent } from '@app/pages/production-plan/operational-plan/filters/city/city-filter.component';
import { TovCategoryFilterComponent } from '@app/pages/production-plan/operational-plan/filters/tov-category/tov-category-filter.component';
import { SectionFilterComponent } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.component';
import { IFilterCriterionType, IFilterItem } from '@front-library/components';

export enum OperationPlanFiltersFields {
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
		field: OperationPlanFiltersFields.tovIds,
		text: 'Наименование ТП: ',
		defaultText: 'Выберите наименование ТП',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: TovFilterComponent,
		active: false,
		records: {
			width: '680px',
			height: '460px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.productionFactoryIds,
		text: 'Производство: ',
		defaultText: 'Выберите производство',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ProductionFactoryFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.planEconomicUserIds,
		text: 'Менеджер ПЭО: ',
		defaultText: 'Выберите менеджера ПЭО',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: PlanEconomicUserFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.productManagerUserIds,
		text: 'Менеджер ТМЗ: ',
		defaultText: 'Выберите менеджера ТМЗ',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ManagerTmzFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.warehouseIds,
		text: 'Склады: ',
		defaultText: 'Выберите склад',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: WareHouseFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.cityIds,
		text: 'Город: ',
		defaultText: 'Выберите город',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CityFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.tovCategoryIds,
		text: 'Категория: ',
		defaultText: 'Выберите категорию',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: TovCategoryFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
	{
		defaultValue: null,
		field: OperationPlanFiltersFields.productionSectionIds,
		text: 'Участок: ',
		defaultText: 'Выберите участок',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: SectionFilterComponent,
		active: false,
		records: {
			width: '400px',
			height: '400px',
		},
	},
];
