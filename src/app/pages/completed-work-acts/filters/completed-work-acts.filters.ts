import { IFilterCriterionType, IFilterItem } from '@front-library/components';
import { ActCostsFilterComponent } from '@app/pages/completed-work-acts/filters/costs-filter.component';
import { ActIdsFilterComponent } from '@app/pages/completed-work-acts/filters/ids-filter.component';
import { ActStatesFilterComponent } from '@app/pages/completed-work-acts/filters/states-filter.component';
import { ActBuUnitsFilterComponent } from '@app/pages/completed-work-acts/filters/buunits-filter.component';
import { ActProviderContractorsFilterComponent } from '@app/pages/completed-work-acts/filters/provider-contractor-filter.component';
import { ActApplicantsFilterComponent } from '@app/pages/completed-work-acts/filters/applicant-filter.component';

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
		defaultText: 'Выберите код',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActIdsFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.state,
		text: 'Состояние',
		defaultText: 'Выберите состояние',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActStatesFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.buUnitIds,
		text: 'БЕ Плательщика',
		defaultText: 'Выберите БЕ Плательщика',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActBuUnitsFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.providerContractorIds,
		text: 'Поставщик услуг',
		defaultText: 'Выберите поставщика услуг',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActProviderContractorsFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.applicantUserId,
		text: 'Заявитель',
		defaultText: 'Выберите заявителя',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActApplicantsFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
	{
		defaultValue: null,
		field: CompletedWorkActsFiltersFields.costIds,
		text: 'Статья',
		defaultText: 'Выберите статью',
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActCostsFilterComponent,
		active: false,
		records: {
			width: '',
			height: '',
		},
	},
];
