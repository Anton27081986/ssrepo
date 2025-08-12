import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

export interface IMpReservationAddOrder {
	authorId: number;
	items: IOrderItemsTypes[];
}

export interface IOrderItemsTypes {
	tovId: number;
	contractorId: number;
	orderRequests: IOrderRequests[];
}
