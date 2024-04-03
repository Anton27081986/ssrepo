import { NgModule } from '@angular/core';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { NgClass, NgForOf } from '@angular/common';

@NgModule({
	declarations: [TabsComponent],
	exports: [TabsComponent],
	imports: [HeadlineModule, NgClass, NgForOf],
})
export class TabsModule {}
