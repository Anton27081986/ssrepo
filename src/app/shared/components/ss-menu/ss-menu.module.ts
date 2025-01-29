import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsMenuComponent } from '@app/shared/components/ss-menu/components/ss-menu.component';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { SsMenuItemComponent } from '@app/shared/components/ss-menu/ss-menu-item/ss-menu-item.component';

const components = [SsMenuComponent, SsMenuItemComponent];

@NgModule({
	imports: [CommonModule, TextModule],
	declarations: [...components],
	providers: [],
	exports: [...components],
})
export class SsMenuModule {}
