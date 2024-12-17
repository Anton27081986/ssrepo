import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NumericInputComponent } from './numeric-input.component';

@NgModule({
	declarations: [NumericInputComponent],
	imports: [CommonModule, CaptionModule, IconModule],
	exports: [NumericInputComponent],
})
export class NumericInputModule {}
