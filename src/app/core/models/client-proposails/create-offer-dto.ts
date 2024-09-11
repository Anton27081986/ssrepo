import { ICreateOfferItem } from '@app/core/models/client-proposails/create-offer-item';

export interface ICreateOfferDto {
	offerId: string;
	items: ICreateOfferItem[];
}
