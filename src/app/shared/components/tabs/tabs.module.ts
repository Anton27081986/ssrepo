import { NgModule } from '@angular/core';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import {TextModule} from "@app/shared/components/typography/text/text.module";

@NgModule({
	declarations: [TabsComponent],
	exports: [TabsComponent],
  imports: [HeadlineModule, NgClass, NgForOf, TextModule, NgIf]
})
export class TabsModule {}
