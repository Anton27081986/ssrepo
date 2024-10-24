import { CardModule } from '@app/shared/components/card/card.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';

export const ModalTransportNoticeImports = [
	CardModule,
	TextModule,
	IconModule,
	SsDividerModule,
	ReactiveFormsModule,
	DatepickerInputModule,
	TextareaModule,
	ButtonModule,
	DateTimePickerComponent
];
