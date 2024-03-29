import { NgModule } from '@angular/core';
import { CorrespondenceComponent } from '@app/shared/components/correspondence/correspondence.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { MailModule } from '@app/shared/components/mail/mail.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import {MessagesModule} from "@app/shared/components/messages/messages.module";
import {TopicModule} from "@app/shared/components/topic/topic.module";
import {CardDropdownModule} from "@app/shared/components/card-dropdown/card-dropdown.module";

@NgModule({
	declarations: [CorrespondenceComponent],
	exports: [CorrespondenceComponent],
	imports: [
		AvatarModule,
		CardModule,
		MailModule,
		HeadlineModule,
		IconModule,
		NgClass,
		AsyncPipe,
		NgForOf,
		TextModule,
		CaptionModule,
		MessagesModule,
		TopicModule,
		CardDropdownModule,
	],
})
export class CorrespondenceModule {}
