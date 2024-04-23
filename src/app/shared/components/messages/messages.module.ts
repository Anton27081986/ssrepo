import { NgModule } from '@angular/core';
import { MessagesComponent } from '@app/shared/components/messages/messages.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { TooltipMenuModule } from '@app/shared/components/tooltip-menu/tooltip-menu.module';

@NgModule({
	declarations: [MessagesComponent],
	exports: [MessagesComponent],
    imports: [
        CardModule,
        HeadlineModule,
        TextModule,
        AsyncPipe,
        NgIf,
        NgForOf,
        AvatarModule,
        IconModule,
        SearchInputModule,
        NgClass,
        AttachmentModule,
        TooltipModule,
        TabsModule,
        CaptionModule,
        PipesModule,
        TooltipMenuModule,
        DatePipe,
    ],
})
export class MessagesModule {}
