import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface ExcessIncomeTovGroupHistory {
	tov: IDictionaryItemDto;
	client: IDictionaryItemDto;
	contractor: IDictionaryItemDto;
	tovSubgroup: IDictionaryItemDto;
	items: ExcessIncomeTovGroupHistoryItem[];
	total: number;
}

export interface ExcessIncomeTovGroupHistoryItem {
	date: string;
	author: IDictionaryItemDto;
	oldExcessIncomePercent: number;
	newExcessIncomePercent: number;
	periodType: string;
}
