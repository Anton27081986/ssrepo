import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AccordionComponent } from './accordion.component';

@NgModule({
	declarations: [AccordionComponent],
	imports: [CommonModule, TextModule, IconModule, NzIconModule],
	exports: [AccordionComponent],
})
export class AccordionModule {}
