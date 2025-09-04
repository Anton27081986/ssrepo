import { Routes } from '@angular/router';
import { ClientsListPageComponent } from './clients-list-page/clients-list-page.component';
import { CLIENT_CARD_ROUTES } from './client-card/client-card.routes';

/**
 * Роуты для модуля "Справочник клиентов"
 *
 * Объединяет функциональность:
 * - Список клиентов (clients-list-page)
 * - Карточка клиента (client-card) со всеми подстраницами
 *
 * URL структура:
 * /clients-dictionary/list - Список клиентов
 * /clients-dictionary/card/:id/basic - Карточка клиента (основная информация)
 * /clients-dictionary/card/:id/sales - Заявки на продажу
 * /clients-dictionary/card/:id/samples - Образцы
 * ... и другие подстраницы карточки
 */
export const CLIENTS_DICTIONARY_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'list',
				component: ClientsListPageComponent,
				title: 'Справочник клиентов',
			},
			{
				path: 'card',
				children: CLIENT_CARD_ROUTES,
			},
			// Редирект для обратной совместимости
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full',
			},
		],
	},
];
