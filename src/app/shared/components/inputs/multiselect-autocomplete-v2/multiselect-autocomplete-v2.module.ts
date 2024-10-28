import { NgModule } from '@angular/core';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import {
	AsyncPipe,
	NgClass,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgTemplateOutlet,
} from '@angular/common';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectOptionV2Component } from '@app/shared/components/multiselect-v2/multiselect-option-v2/multiselect-option-v2.component';
import { MultiselectChipsV2Component } from '@app/shared/components/multiselect-v2/multiselect-chips-v2/multiselect-chips-v2.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { MultiselectAutocompleteV2Component } from '@app/shared/components/inputs/multiselect-autocomplete-v2/multiselect-autocomplete-v2.component';

@NgModule({
	declarations: [
		MultiselectOptionV2Component,
		MultiselectChipsV2Component,
		MultiselectAutocompleteV2Component,
	],
	exports: [
		MultiselectOptionV2Component,
		MultiselectChipsV2Component,
		MultiselectAutocompleteV2Component,
	],
	imports: [
		CaptionModule,
		NgIf,
		InputModule,
		TextModule,
		NgForOf,
		IconModule,
		NgClass,
		SsDividerModule,
		ReactiveFormsModule,
		AsyncPipe,
		FormsModule,
		NgTemplateOutlet,
		NgSwitch,
		NgSwitchCase,
		TooltipModule,
	],
})
export class MultiselectAutocompleteV2Module {}
