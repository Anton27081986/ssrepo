import { NgModule } from '@angular/core';
import { InputComponent } from '@app/shared/components/inputs/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';

@NgModule({
	declarations: [InputComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IconModule,
		CaptionModule,
		TextModule,
		SsDividerModule,
	],
	exports: [InputComponent],
})
export class InputModule {}
