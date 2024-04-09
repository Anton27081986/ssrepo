import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { FilterInputComponent } from './filter-input.component';

@NgModule({
	declarations: [FilterInputComponent],
	exports: [FilterInputComponent],
	imports: [CommonModule, CaptionModule, IconModule],
})
export class FilterInputModule {}
