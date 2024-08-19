import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface IRawMaterialAccountingContract {
	id: number;
	contractNumber: string;
	contractor: IDictionaryItemDto;
	contractDetail: IDictionaryItemDto;
	quantityTotal: number;
	quantityReceived: number;
	quantityRemaining: number;
	price: number;
	periodStartDate: string;
	periodEndDate: string;
	paymentConditions: string;
	deliveryConditions: string;
	notificationDate: string;
	user: IDictionaryItemDto;
	dateCreated: string;
	status: IDictionaryItemDto;
}
