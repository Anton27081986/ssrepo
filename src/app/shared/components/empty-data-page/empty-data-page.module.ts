import { NgModule } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NgIf } from '@angular/common';
import { EmptyDataPageComponent } from '@app/shared/components/empty-data-page/empty-data-page.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';

@NgModule({
	declarations: [EmptyDataPageComponent],
	exports: [EmptyDataPageComponent],
	imports: [CardModule, HeadlineModule, TextModule, ButtonModule, NgIf, CaptionModule],
})
export class EmptyDataPageModule {}
