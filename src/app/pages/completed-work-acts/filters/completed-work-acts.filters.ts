import { IFilterCriterionType, IFilterItem } from '@front-library/components';
import { CostFilterComponent } from '@app/pages/completed-work-acts/filters/cost-filter.component';

export enum CompletedWorkActsFiltersFields {
	ids = 'ids',
	state = 'state',
	buUnitIds = 'buUnitIds',
	providerContractorIds = 'providerContractorIds',
	applicantUserId = 'applicantUserIds',
	costIds = 'costIds',

}

export const completedWorkActsFilter: IFilterItem[] = [
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.ids,
		text: 'Код',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.state,
		text: 'Состояние',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.buUnitIds,
		text: 'БЕ Плательщика',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.providerContractorIds,
		text: 'Поставщик услуг',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.applicantUserId,
		text: 'Заявитель',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.costIds,
		text: 'Статья',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: CostFilterComponent,
		active: false,
	},
];
