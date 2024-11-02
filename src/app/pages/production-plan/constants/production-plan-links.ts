import { ITab } from '@app/shared/components/tabs/tab';

export const ProductionPlanTabs: ITab[] = [
	{
		label: 'Оперативный план',
		name: 'plan-days',
		isVisible: true,
	},
	{
		label: 'МТМЗ',
		name: 'mtmz',
		isVisible: false,
	},
	{
		label: 'ГП',
		name: 'gp',
		isVisible: false,
	},
];
