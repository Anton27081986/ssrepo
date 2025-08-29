import { Routes } from '@angular/router';
import { ClientProposalsPageComponent } from './client-proposals-page/client-proposals-page.component';
import { ClientProposalsInfoComponent } from './client-proposals-info/client-proposals-info.component';
import { ClientProposalsBusinessTripsTabComponent } from './client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.component';
import { ClientProposalsDevelopmentTabComponent } from './client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.component';
import { ClientProposalsNewsLineTabComponent } from './client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.component';
import { ClientProposalsTradeListTabComponent } from './client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.component';
import { ClientProposalsSamplesTabComponent } from './client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.component';
import { ClientProposalsContractorsTabComponent } from './client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.component';

/**
 * Роуты для модуля "Коммерческие предложения клиентов"
 *
 * Структура модуля:
 * - Главная страница коммерческих предложений (ClientProposalsPageComponent)
 * - Информация по клиенту с табами (ClientProposalsInfoComponent)
 *   - Командировки (business-trips)
 *   - Разработки (development)
 *   - Лента новостей (news-line)
 *   - Торговая деятельность (trade-list)
 *   - Образцы (samples)
 *   - Подрядчики (contractors) - дефолтный таб
 *
 * URL структура:
 * /client-proposals-page/:clientId - Информация по клиенту
 * /client-proposals-page/:clientId/business-trips - Таб командировки
 * /client-proposals-page/:clientId/development - Таб разработки
 * /client-proposals-page/:clientId/news-line - Таб лента новостей
 * /client-proposals-page/:clientId/trade-list - Таб торговая деятельность
 * /client-proposals-page/:clientId/samples - Таб образцы
 * /client-proposals-page/:clientId/contractors - Таб подрядчики (по умолчанию)
 *
 * Модуль включает:
 * - Фильтрацию и поиск коммерческих предложений
 * - Просмотр и управление предложениями по табам
 * - Загрузку и отправку файлов
 * - Модальные окна для различных операций
 * - Настройки отображения колонок
 */
export const CLIENT_PROPOSALS_PAGE_ROUTES: Routes = [
	{
		path: ':clientId',
		component: ClientProposalsInfoComponent,
		data: {
			animation: 'animation',
		},
		title: 'Коммерческие предложения клиента',
		children: [
			{
				path: 'business-trips',
				component: ClientProposalsBusinessTripsTabComponent,
				title: 'Командировки',
			},
			{
				path: 'development',
				component: ClientProposalsDevelopmentTabComponent,
				title: 'Разработки',
			},
			{
				path: 'news-line',
				component: ClientProposalsNewsLineTabComponent,
				title: 'Лента новостей',
			},
			{
				path: 'trade-list',
				component: ClientProposalsTradeListTabComponent,
				title: 'Торговая деятельность',
			},
			{
				path: 'samples',
				component: ClientProposalsSamplesTabComponent,
				title: 'Образцы',
			},
			{
				path: 'contractors',
				component: ClientProposalsContractorsTabComponent,
				title: 'Подрядчики',
			},
			{
				path: '**',
				redirectTo: 'contractors',
			},
		],
	},
];
