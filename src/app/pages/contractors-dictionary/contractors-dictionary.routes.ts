import { Routes } from '@angular/router';

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
	},
];
