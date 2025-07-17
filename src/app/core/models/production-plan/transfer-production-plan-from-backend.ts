import { FormControl } from '@angular/forms';

export interface TransferProductionPlanFromBackend {
	id: number;
	orderId: number;
	customerUser: {
		id: number;
		name: string;
	};
	quantity: number;
	productionDate: string;
}

export interface TransferProductionPlanMap {
	id: number;
	orderId: number;
	customerUser: {
		id: number;
		name: string;
	};
	quantity: number;
	countForPostpone: FormControl<number | null>;
	productionDateControl: FormControl<Date | null>;
	originalProductionDate: Date;
}

export interface TransferProductionPlanPatch {
	id: number;
	orderId: number;
	quantity: number;
	productionDate: string;
}
