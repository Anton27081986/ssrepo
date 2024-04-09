import { NgModule } from '@angular/core';
import { TooltipMenuComponent } from '@app/shared/components/tooltip-menu/tooltip-menu.component';
import { NgClass, NgForOf } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';

@NgModule({
	declarations: [TooltipMenuComponent],
	exports: [TooltipMenuComponent],
	imports: [NgForOf, IconModule, NgClass, TextModule],
})
export class TooltipMenuModule {}
