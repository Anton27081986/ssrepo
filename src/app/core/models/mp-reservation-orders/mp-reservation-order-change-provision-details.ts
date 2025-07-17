import { IProvisionDetailsTypes } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

export interface IReservationOrderChangeProvisionDetails
	extends IProvisionDetailsTypes {
	errors: {
		productionDate?: boolean;
		provisionDate?: boolean;
		manufacturingAmount?: boolean;
	};
}

export interface IApproveChangeRow {
	oldDate: string;
	newDate: string;
	oldAmount: number;
	newAmount: number;
}
