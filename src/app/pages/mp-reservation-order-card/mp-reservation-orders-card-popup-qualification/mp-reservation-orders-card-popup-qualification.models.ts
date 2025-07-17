import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

export interface IClarifyOrder {
	tovId: number;
	requests: IOrderRequests[];
}
