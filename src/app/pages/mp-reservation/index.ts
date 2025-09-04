/**
 * Barrel export для модуля "MP Резервирование"
 *
 * Экспортирует роуты для lazy loading и основные компоненты модуля
 */

export { MP_RESERVATION_ROUTES } from './mp-reservation.routes';

// Основные компоненты
export { MPReservationOrdersComponent } from './mp-reservation-orders/mp-reservation-orders.component';
export { MpReservationOrderCardComponent } from './mp-reservation-order-card/mp-reservation-order-card.component';

// Re-export типов и интерфейсов (если необходимо)
// export type { ... } from './types/...';
