import { NgModule } from '@angular/core';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';
import { NgClass } from '@angular/common';

@NgModule({
	declarations: [TagV2Component],
	exports: [TagV2Component],
	imports: [NgClass],
})
export class TagV2Module {}
