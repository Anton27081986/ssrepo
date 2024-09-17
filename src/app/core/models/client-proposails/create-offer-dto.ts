import { ICreateOfferItem } from '@app/core/models/client-proposails/create-offer-item';

export interface ICreateOfferDto {
	clientId: number;
	items: ICreateOfferItem[];
}
