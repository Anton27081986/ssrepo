import { Routes } from '@angular/router';
import { CONTRACTOR_CARD_ROUTES } from '@app/pages/contractors-dictionary/contractor-card/contractor-card.routes';

/**
 * Все компоненты загружаются через lazy loading для оптимизации производительности
 */
export const CONTRACTORS_DICTIONARY_ROUTES: Routes = [
	{
		path: '',
		loadComponent: async () =>
			import('./contractors-dictionary.component').then(
				(c) => c.ContractorsDictionaryComponent
			),
		title: 'Справочник контрагентов',
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'card',
				children: CONTRACTOR_CARD_ROUTES,
			},
		],
	},
];
