import { AsyncPipe } from "@angular/common";
import { AvatarComponent } from "@app/shared/components/avatar/avatar.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { CaptionComponent } from "@app/shared/components/typography/caption/caption.component";
import { SsDividerComponent } from "@app/shared/components/ss-divider/ss-divider.component";
import { IconComponent } from "@app/shared/components/icon/icon.component";

export const ProfileCardImports = [
	AsyncPipe,
	AvatarComponent,
	TextComponent,
	CaptionComponent,
	SsDividerComponent,
	IconComponent
]
