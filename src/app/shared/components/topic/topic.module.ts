import { NgModule } from '@angular/core';
import { TopicComponent } from '@app/shared/components/topic/topic.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { AsyncPipe, NgForOf } from '@angular/common';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';

@NgModule({
	declarations: [TopicComponent],
	exports: [TopicComponent],
	imports: [
		CardModule,
		IconModule,
		HeadlineModule,
		TextModule,
		CaptionModule,
		AsyncPipe,
		NgForOf,
		SearchInputModule,
	],
})
export class TopicModule {}
