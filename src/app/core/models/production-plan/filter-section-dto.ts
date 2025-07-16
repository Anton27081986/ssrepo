import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface FilterSectionDto {
	parentItems: FilterSectionParentItems[];
	items: IDictionaryItemDto[];
}

export interface FilterSectionParentItems {
	data: IDictionaryItemDto;
	childs: IDictionaryItemDto[];
}
