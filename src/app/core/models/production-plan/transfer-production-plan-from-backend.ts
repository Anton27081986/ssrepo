import { FormControl } from '@angular/forms';
import { IDictionaryItemDto } from '@front-components/components';

export interface TransferProductionPlanFromBackend {
	id: number;
	orderId: number;
	linkToDetail: string;
	customerUser: IDictionaryItemDto;
	quantity: number;
	productionDate: string;
}

export interface TransferProductionPlanMap {
	id: number;
	orderId: number;
	customerUser: IDictionaryItemDto;
	quantity: number;
	linkToDetail: string;
}

export interface TransferProductionPlanPatch {
	productionDate: string | number | null;
	quantity: string | number | null;
	id: number;
}
