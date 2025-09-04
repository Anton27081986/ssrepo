import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

/**
 * Роуты для модуля "Профиль пользователя"
 *
 * Структура модуля:
 * - Основной компонент профиля (ProfileComponent) - контейнер с навигацией
 * - Настройки (SettingsComponent) - основная информация пользователя
 * - Смена пароля (ChangePasswordComponent) - форма смены пароля
 * - Дружественные аккаунты (FriendlyAccountsPageComponent) - управление аккаунтами
 * - Мое меню (MyMenuComponent) - персонализация меню
 * - Порядок виджетов (OrderWidgetsComponent) - настройка виджетов
 * - Уведомления (NotificationsComponent) - настройки уведомлений
 *
 * URL структура:
 * /profile/settings - Основная информация
 * /profile/change-password - Смена пароля
 * /profile/friendly-accounts - Дружественные аккаунты
 * /profile/my-menu - Персонализация меню
 * /profile/order-widgets - Настройка виджетов
 * /profile/notifications - Настройки уведомлений
 *
 * Все компоненты загружаются через lazy loading для оптимизации производительности
 */
export const PROFILE_ROUTES: Routes = [
	{
		path: '',
		component: ProfileComponent,
		children: [
			{
				path: 'settings',
				loadComponent: async () =>
					import('./settings/settings.component').then(
						(c) => c.SettingsComponent
					),
				title: 'Основная информация',
			},
			{
				path: 'change-password',
				loadComponent: async () =>
					import('./change-password/change-password.component').then(
						(c) => c.ChangePasswordComponent
					),
				title: 'Смена пароля',
			},
			{
				path: 'friendly-accounts',
				loadComponent: async () =>
					import(
						'./friendly-accounts-page/friendly-accounts-page.component'
					).then((c) => c.FriendlyAccountsPageComponent),
				title: 'Дружественные аккаунты',
			},
			{
				path: 'my-menu',
				loadComponent: async () =>
					import('./my-menu/my-menu.component').then(
						(c) => c.MyMenuComponent
					),
				title: 'Персонализация меню',
			},
			{
				path: 'order-widgets',
				loadComponent: async () =>
					import('./order-widgets/order-widgets.component').then(
						(c) => c.OrderWidgetsComponent
					),
				title: 'Настройка виджетов',
			},
			{
				path: 'notifications',
				loadComponent: async () =>
					import('./notifications/notifications.component').then(
						(c) => c.NotificationsComponent
					),
				title: 'Настройки уведомлений',
			},
			// Редирект на настройки по умолчанию
			{
				path: '',
				redirectTo: 'settings',
				pathMatch: 'full',
			},
			// Обработка неизвестных роутов
			{
				path: '**',
				redirectTo: 'settings',
			},
		],
	},
];
