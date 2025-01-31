import { AsyncPipe } from "@angular/common";
import { ProfileCardComponent } from "@app/shared/components/profile-card/profile-card.component";
import { ButtonComponent } from "@app/shared/components/buttons/button/button.component";
import { IconComponent } from "@app/shared/components/icon/icon.component";
import { RouterLink } from "@angular/router";
import { SsDividerComponent } from "@app/shared/components/ss-divider/ss-divider.component";
import { AvatarComponent } from "@app/shared/components/avatar/avatar.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { CaptionComponent } from "@app/shared/components/typography/caption/caption.component";
import { SearchInputComponent } from "@app/shared/components/inputs/search-input/search-input.component";

export const ProfilePopupImports = [
	AsyncPipe,
	ProfileCardComponent,
	ButtonComponent,
	IconComponent,
	RouterLink,
	SsDividerComponent,
	AvatarComponent,
	TextComponent,
	CaptionComponent,
	SearchInputComponent,
	ProfileCardComponent
]
