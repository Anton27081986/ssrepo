import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TabsComponent} from "@app/shared/components/tabs/tabs.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {UserCardComponent} from "@app/shared/components/user-card/user-card.component";

export const BirthdayImports = [
	AsyncPipe,
	ReactiveFormsModule,
	MapperPipe,
	DateTimePickerComponent,
	CardComponent,
	TextComponent,
	ButtonComponent,
	IconComponent,
	TabsComponent,
	SsDividerComponent,
	LoaderComponent,
	UserCardComponent,
	EmptyPlaceholderComponent,
	HeadlineComponent
];
