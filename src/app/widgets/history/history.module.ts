import { NgModule } from '@angular/core';
import { HistoryComponent } from '@app/widgets/history/history.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgForOf, NgIf } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';

@NgModule({
	declarations: [HistoryComponent],
	exports: [HistoryComponent],
	imports: [CardModule, HeadlineModule, IconModule, NgIf, TextModule, NgForOf],
})
export class HistoryModule {}
