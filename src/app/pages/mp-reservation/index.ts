// Barrel export для модуля "Заказы на резервирование МТО"
export { MP_RESERVATION_ROUTES } from './mp-reservation.routes';

// Основные компоненты
export { MPReservationOrdersComponent } from './mp-reservation-orders/mp-reservation-orders.component';
export { MpReservationOrderCardComponent } from './mp-reservation-order-card/mp-reservation-order-card.component';

// Подкомпоненты карточки заказа
export { MpReservationOrdersCardPopupRejectOrderComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-reject-order/mp-reservation-orders-card-popup-reject-order.component';
export { MpReservationOrdersCardPopupChangeProvisionDateComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-date/mp-reservation-orders-card-popup-change-provision-date.component';
export { MpReservationOrdersCardPopupQualificationComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification.component';
export { MpReservationOrdersCardPopupChangeProvisionDetailsComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-details/mp-reservation-orders-card-popup-change-provision-details.component';
export { MpReservationOrdersCardPopupChangeManagerComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-change-manager/mp-reservation-orders-card-popup-change-manager.component';
export { MpReservationOrdersCardPopupChangeApproveDetailsChangeComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-change-approve-details-change/mp-reservation-orders-card-popup-change-approve-details-change.component';
export { MpReservationOrdersCardPopupOrderInProductionComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-order-in-production/mp-reservation-orders-card-popup-order-in-production.component';
export { MpReservationOrdersCardPopupOrderApprovalComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-order-approval/mp-reservation-orders-card-popup-order-approval.component';
export { MpReservationOrdersCardPopupCancelActionComponent } from './mp-reservation-order-card/mp-reservation-orders-card-popup-cancel-action/mp-reservation-orders-card-popup-cancel-action.component';

// Подкомпоненты списка заказов
export { MpReservationOrdersPopupDateProvisionComponent } from './mp-reservation-orders/mp-reservation-orders-popup-date-provision/mp-reservation-orders-popup-date-provision.component';
export { MpReservationOrdersPopupHistoryComponent } from './mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history..component';
export { MpReservationOrdersPopupRemnantsDetailsComponent } from './mp-reservation-orders/mp-reservation-orders-popup-remnants-details/mp-reservation-orders-popup-remnants-details..component';
export { MpReservationOrdersPopupAddOrderComponent } from './mp-reservation-orders/mp-reservation-orders-popup-add-order/mp-reservation-orders-popup-add-order.component';
export { MpReservationOrdersPopupTotalAmountComponent } from './mp-reservation-orders/mp-reservation-orders-popup-total-amount/mp-reservation-orders-popup-total-amount.component';
export { MpReservationOrdersPopupChangeQueueComponent } from './mp-reservation-orders/mp-reservation-orders-popup-change-queue/mp-reservation-orders-popup-change-queue.component';

// Re-export моделей из core (для удобства)
export type { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
export type { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
