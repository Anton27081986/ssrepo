import { NgModule } from '@angular/core';
import { MailComponent } from '@app/widgets/correspondence/mail/mail.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { AsyncPipe, CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';
import { CardDropdownModule } from '@app/shared/components/card-dropdown/card-dropdown.module';
import { ComponentsModule } from '@app/components/components.module';
import { ChipsUserSearchModule } from '@app/shared/components/inputs/chips-user-search/chips-user-search.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';

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
		CardDropdownModule,
		ComponentsModule,
		ChipsUserSearchModule,
		ReactiveFormsModule,
		AsyncPipe,
		NgClass,
		HeadlineModule,
		TextModule,
		DialogModule,
		CommonModule,
	],
})
export class MailModule {}
