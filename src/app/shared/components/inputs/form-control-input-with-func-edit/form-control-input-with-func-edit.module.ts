import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { FormControlInputWithFuncEditComponent } from '@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.component';

@NgModule({
	declarations: [FormControlInputWithFuncEditComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IconModule,
		CaptionModule,
		TextModule,
		SsDividerModule,
	],
	exports: [FormControlInputWithFuncEditComponent],
})
export class FormControlInputWithFuncEditModule {}
