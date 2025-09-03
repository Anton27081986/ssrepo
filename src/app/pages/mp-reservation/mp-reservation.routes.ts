import { Routes } from '@angular/router';
import { mpReservationOrdersPermissionsGuard } from '@app/core/guards/mp-reservation-orders';

/**
 * Роуты для модуля "MP Резервирование"
 *
 * Структура модуля:
 * - Основная страница со списком заказов резервирования (MPReservationOrdersComponent)
 * - Детальная карточка заказа резервирования (MpReservationOrderCardComponent)
 * - Модальные окна для управления заказами
 *
 * URL структура:
 * /mp-reservation-orders - Список заказов резервирования
 * /mp-reservation-orders/:id - Карточка заказа резервирования
 *
 * Модуль включает:
 * - Управление заказами резервирования MP
 * - Просмотр деталей заказов
 * - Изменение статусов заказов
 * - Управление очередью заказов
 * - Работу с остатками на складе
 * - Историю изменений заказов
 *
 * Доступ к модулю контролируется mpReservationOrdersPermissionsGuard
 * Все компоненты загружаются через lazy loading для оптимизации производительности
 */
export const MP_RESERVATION_ROUTES: Routes = [
	{
		path: '',
		canActivate: [mpReservationOrdersPermissionsGuard],
		children: [
			{
				path: 'orders',
				loadComponent: async () =>
					import(
						'./mp-reservation-orders/mp-reservation-orders.component'
					).then((c) => c.MPReservationOrdersComponent),
				title: 'Заказы резервирования MP',
				data: {
					animation: 'animation',
				},
			},
			{
				path: 'orders/:id',
				loadComponent: async () =>
					import(
						'./mp-reservation-order-card/mp-reservation-order-card.component'
					).then((c) => c.MpReservationOrderCardComponent),
				title: 'Карточка заказа резервирования',
				data: {
					animation: 'animation',
				},
			},
			// Редирект на список заказов по умолчанию
			{
				path: '',
				redirectTo: 'orders',
				pathMatch: 'full',
			},
			// Обработка неизвестных роутов
			{
				path: '**',
				redirectTo: 'orders',
			},
		],
	},
];
