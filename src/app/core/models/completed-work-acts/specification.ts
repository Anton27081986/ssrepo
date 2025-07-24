import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface ICompletedWorkActSpecification {
	id: number;
	completedWorkActId?: number;
	tovUnit?: IDictionaryItemDto;
	cost?: IDictionaryItemDto;
	faObject?: IDictionaryItemDto;
	faAsset?: IDictionaryItemDto;
	project?: IDictionaryItemDto;
	dept?: IDictionaryItemDto;
	section?: IDictionaryItemDto;
	user?: IDictionaryItemDto;
	sum?: number;
}
