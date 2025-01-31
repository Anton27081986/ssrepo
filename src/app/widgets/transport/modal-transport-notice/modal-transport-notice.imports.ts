import { ReactiveFormsModule } from '@angular/forms';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { CardComponent } from "@app/shared/components/card/card.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { IconComponent } from "@app/shared/components/icon/icon.component";
import { SsDividerComponent } from "@app/shared/components/ss-divider/ss-divider.component";
import { TextareaComponent } from "@app/shared/components/textarea/textarea.component";
import { ButtonComponent } from "@app/shared/components/buttons/button/button.component";

export const ModalTransportNoticeImports = [
	ReactiveFormsModule,
	DateTimePickerComponent,
	CardComponent,
	TextComponent,
	IconComponent,
	SsDividerComponent,
	TextareaComponent,
	ButtonComponent
];
