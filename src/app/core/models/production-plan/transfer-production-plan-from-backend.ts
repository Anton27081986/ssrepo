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
	productionDate: string | number | null;
	quantity: string | number | null;
	id: number;
}
