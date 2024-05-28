import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import {TextModule} from "@app/shared/components/typography/text/text.module";

@NgModule({
	declarations: [AccordionComponent],
	imports: [CommonModule, TextModule],
	exports: [AccordionComponent],
})
export class AccordionModule {}
