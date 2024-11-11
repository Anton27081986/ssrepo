import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface ICompletedWorkActSpecification {
	id: number;
	completedWorkActId?: number;
	service?: IDictionaryItemDto;
	comment?: string;
	quantity?: number;
	tovUnit?: IDictionaryItemDto;
	cost?: IDictionaryItemDto;
	faObject?: IDictionaryItemDto;
	faAsset?: IDictionaryItemDto;
	project?: IDictionaryItemDto;
	dept?: IDictionaryItemDto;
	section?: IDictionaryItemDto;
	user?: IDictionaryItemDto;
	amount?: number;
}
