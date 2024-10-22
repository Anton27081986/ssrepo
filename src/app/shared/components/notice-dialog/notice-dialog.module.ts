import { NgModule } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NgIf } from '@angular/common';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [NoticeDialogComponent],
	exports: [NoticeDialogComponent],
	imports: [CardModule, HeadlineModule, TextModule, ButtonModule, NgIf, IconModule],
})
export class NoticeDialogModule {}
