import { NgModule } from '@angular/core';
import { CorrespondenceComponent } from '@app/widgets/correspondence/correspondence.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { MailModule } from '@app/widgets/correspondence/mail/mail.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { MessagesModule } from '@app/widgets/correspondence/messages/messages.module';
import { TopicModule } from '@app/widgets/correspondence/topic/topic.module';
import { CardDropdownModule } from '@app/shared/components/card-dropdown/card-dropdown.module';
import {LoaderModule} from "@app/shared/components/loader/loader.module";

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
        LoaderModule,
        NgIf,
    ],
})
export class CorrespondenceModule {}
