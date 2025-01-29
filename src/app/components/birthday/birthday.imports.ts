import { AsyncPipe } from '@angular/common';
import { CardModule } from '@app/shared/components/card/card.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { ComponentsModule } from '@app/components/components.module';

export const BirthdayImports = [
	AsyncPipe,
	CardModule,
	TextModule,
	ButtonModule,
	IconModule,
	TabsModule,
	ReactiveFormsModule,
	MapperPipe,
	SsDividerModule,
	EmptyPlaceholderModule,
	HeadlineModule,
	LoaderModule,
	ComponentsModule,
	DateTimePickerComponent,
];
