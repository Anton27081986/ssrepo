import { NgModule } from '@angular/core';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [TabsComponent],
	exports: [TabsComponent],
	imports: [HeadlineModule, NgClass, NgForOf, TextModule, NgIf, IconModule],
})
export class TabsModule {}
