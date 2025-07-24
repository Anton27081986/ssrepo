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
		queryParamConfig: {
			mapTo: (value: IFilterCriterionType) =>
				Array.isArray(value) ? value.join(',') : '',
			mapFrom: (value: string[]) => value.map((v) => Number(v)),
		},
		valueComponent: ActIdsFilterComponent,
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
		valueComponent: ActStatesFilterComponent,
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
		valueComponent: ActBuUnitsFilterComponent,
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
		valueComponent: ActProviderContractorsFilterComponent,
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
		valueComponent: ActApplicantsFilterComponent,
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
		valueComponent: ActCostsFilterComponent,
		active: false,
	},
];
