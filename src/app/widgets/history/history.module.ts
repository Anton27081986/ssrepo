import { NgModule } from '@angular/core';
import { HistoryComponent } from '@app/widgets/history/history.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {NzTableModule} from "ng-zorro-antd/table";
import {AccordionModule} from "@app/shared/components/accordion/accordion.module";

@NgModule({
	declarations: [HistoryComponent],
	exports: [HistoryComponent],
	imports: [
		CardModule,
		HeadlineModule,
		IconModule,
		NgIf,
		TextModule,
		NgForOf,
		NzPaginationModule,
		DatePipe,
		NzTableModule,
		AccordionModule,
	],
})
export class HistoryModule {}
