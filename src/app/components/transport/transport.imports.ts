import { AsyncPipe, NgClass } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NoticeModule } from '@app/components/notice/notice.module';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { TagModule } from '@app/shared/components/tag/tag.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';

export const TransportImports = [
	AsyncPipe,
	TextModule,
	ButtonModule,
	IconModule,
	NoticeModule,
	MapperPipe,
	TagModule,
	NgClass,
	CardModule,
	SsDividerModule,
];
