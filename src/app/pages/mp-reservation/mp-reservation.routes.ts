import { Routes } from '@angular/router';
import { MPReservationOrdersComponent } from './mp-reservation-orders/mp-reservation-orders.component';
import { MpReservationOrderCardComponent } from './mp-reservation-order-card/mp-reservation-order-card.component';

/**
 * Роуты для модуля "Заказы на резервирование МТО"
 *
 * Структура модуля:
 * - Список заказов на резервирование (MPReservationOrdersComponent)
 * - Карточка заказа на резервирование (MpReservationOrderCardComponent)
 *
 * URL структура:
 * /mp-reservation-orders - Список заказов на резервирование МТО
 * /mp-reservation-orders/:id - Карточка конкретного заказа
 *
 * Модуль включает:
 * - Фильтрацию и поиск заказов
 * - Просмотр и управление заказами
 * - Изменение очередности, дат поставки
 * - Управление спецификациями заказов
 * - История изменений заказов
 * - Модальные окна для различных операций
 */
export const MP_RESERVATION_ROUTES: Routes = [
	{
		path: '',
		component: MPReservationOrdersComponent,
		data: {
			animation: 'animation',
		},
		title: 'Заказы на резервирование МТО',
	},
	{
		path: ':id',
		component: MpReservationOrderCardComponent,
		data: {
			animation: 'animation',
		},
		title: 'Карточка заказа на резервирование',
	},
];
