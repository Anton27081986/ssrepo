import { AsyncPipe } from '@angular/common';
import { CardModule } from '@app/shared/components/card/card.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { ComponentsModule } from '@app/components/components.module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';

export const BirthdayImports = [
	AsyncPipe,
	CardModule,
	TextModule,
	ButtonModule,
	IconModule,
	DatepickerInputModule,
	TabsModule,
	ReactiveFormsModule,
	MapperPipe,
	SsDividerModule,
	ComponentsModule,
	EmptyPlaceholderModule,
	HeadlineModule,
	LoaderModule,
];
