import {IProvisionDetailsTypes} from "@app/core/models/mp-reservation-orders/mp-reservation-order";

export interface IReservationOrderApproveDetailsChange extends IProvisionDetailsTypes {
    errors: {
        productionDate?: boolean;
        provisionDate?: boolean;
        manufacturingAmount?: boolean;
    }
}