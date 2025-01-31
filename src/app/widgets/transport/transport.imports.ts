import { AsyncPipe, NgClass } from '@angular/common';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { CardComponent } from "@app/shared/components/card/card.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { ButtonComponent } from "@app/shared/components/buttons/button/button.component";
import { IconComponent } from "@app/shared/components/icon/icon.component";
import { NoticeComponent } from "@app/shared/components/notice/notice.component";
import { SsDividerComponent } from "@app/shared/components/ss-divider/ss-divider.component";
import { TagComponent } from "@app/shared/components/tag/tag.component";

export const TransportImports = [
	AsyncPipe,
	MapperPipe,
	NgClass,
	CardComponent,
	TextComponent,
	ButtonComponent,
	IconComponent,
	NoticeComponent,
	SsDividerComponent,
	TagComponent
];
