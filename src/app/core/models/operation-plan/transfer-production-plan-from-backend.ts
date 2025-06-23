import { FormControl } from '@angular/forms';

export interface TransferProductionPlanFromBackend {
	orderId: number;
	customerUser: {
		id: number;
		name: string;
	};
	quantity: number;
	productionDate: string;
}

export interface TransferProductionPlanMap {
	orderId: number;
	customerUser: {
		id: number;
		name: string;
	};
	quantity: number;
	countForPostpone: FormControl<number | null>;
	productionDateControl: FormControl<Date | null>;
}

export interface TransferProductionPlanPatch {
	orderId: number;
	quantity: number;
	productionDate: string;
}
