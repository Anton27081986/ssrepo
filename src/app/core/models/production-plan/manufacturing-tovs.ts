import { IDictionaryItemDto } from '@front-library/components';
import { FormControl } from '@angular/forms';

export interface ManufacturingTovs {
	tov: IDictionaryItemDto;
	section: IDictionaryItemDto[];
}

export interface ManufacturingSelectedTovs {
	tov: IDictionaryItemDto;
	section: IDictionaryItemDto[];
	selected: FormControl<boolean | null>;
	selectedSection: IDictionaryItemDto | null;
}
