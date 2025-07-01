import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

export interface IQueueOrderDto {
	id: number;
	status: number;
	position: number;
	personificationOrder: IMpReservationOrder;
}

export interface IQueueReorderPosition {
	oldPosition: number;
	newPosition: number;
}
