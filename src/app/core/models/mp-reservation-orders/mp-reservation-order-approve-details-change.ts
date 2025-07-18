import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IDictionaryItemDto } from '@front-components/components';

export interface IApproveChangeData {
	oldItems: IOrderRequests[];
	newItems: Array<{ requestedProvisionDate: string; amount: number }>;
	tov: IDictionaryItemDto;
	id: number;
}
