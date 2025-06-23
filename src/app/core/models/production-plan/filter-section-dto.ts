import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface FilterSectionDto {
	data: IDictionaryItemDto;
	childs: IDictionaryItemDto[];
}
