import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface ExccessIncomeCommentsHistory {
	date: string;
	author: IDictionaryItemDto;
	comment: string;
}
