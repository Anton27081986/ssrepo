import { NgModule } from '@angular/core';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [SelectV2Component],
	exports: [SelectV2Component],
	imports: [CaptionModule, NgIf, NgClass, NgForOf, ReactiveFormsModule],
})
export class SelectV2Module {}
