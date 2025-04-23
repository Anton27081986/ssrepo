import {IOrderRequests} from "@app/core/models/mp-reservation-orders/mp-reservation-order";

export interface IOrderChangeQualification extends IOrderRequests {
    errors: {
        amount?: boolean;
        requestedProvisionDate?: boolean;
    }
}