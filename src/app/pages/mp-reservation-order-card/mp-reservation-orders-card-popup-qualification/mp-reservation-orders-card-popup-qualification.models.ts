import {IMpReservationAddOrder} from "@app/core/models/mp-reservation-orders/mp-reservation-add-order";

export interface IClarifyOrder {
	tovId: number;
	requests: IMpReservationAddOrder;
}
