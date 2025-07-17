import { IDictionaryItemDto } from '@front-components/components';
import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';

export interface IApproveClarificationResponse {
	authorId: number;
	author: IDictionaryItemDto;
	tovId: number;
	tov: IDictionaryItemDto;
	provisionRequests: IOrderRequests[];
}
