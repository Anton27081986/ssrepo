import { NgModule } from '@angular/core';
import { MailComponent } from '@app/shared/components/mail/mail.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { NgForOf, NgIf } from '@angular/common';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';

@NgModule({
	declarations: [MailComponent],
	exports: [MailComponent],
	imports: [
		CardModule,
		InputModule,
		CKEditorModule,
		IconModule,
		ButtonModule,
		CaptionModule,
		NgIf,
		AttachmentModule,
		NgForOf,
	],
})
export class MailModule {}
