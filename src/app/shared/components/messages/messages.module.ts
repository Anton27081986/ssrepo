import { NgModule } from '@angular/core';
import { MessagesComponent } from '@app/shared/components/messages/messages.component';
import {CardModule} from "@app/shared/components/card/card.module";
import {HeadlineModule} from "@app/shared/components/typography/headline/headline.module";
import {TextModule} from "@app/shared/components/typography/text/text.module";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AvatarModule} from "@app/shared/components/avatar/avatar.module";
import {IconModule} from "@app/shared/components/icon/icon.module";

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
		IconModule
	]
})
export class MessagesModule {}
