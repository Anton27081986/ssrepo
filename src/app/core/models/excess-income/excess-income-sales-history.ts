import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface ExcessIncomeSalesHistory {
	id: number;
	detailLink: string;
	contractor: IDictionaryItemDto;
	shipDate: string;
	status: IDictionaryItemDto;
	price: number;
	quantity: number;
	sum: number;
	currency: string;
}
