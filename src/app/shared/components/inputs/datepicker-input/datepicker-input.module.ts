import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { DatepickerInputComponent } from '@app/shared/components/inputs/datepicker-input/datepicker-input.component';

@NgModule({
	declarations: [DatepickerInputComponent],
	exports: [DatepickerInputComponent],
	imports: [CommonModule, CaptionModule, IconModule],
})
export class DatepickerInputModule {}
