import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { CardComponent } from '@app/shared/components/card/card.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {DateRangeComponent} from "@app/shared/components/inputs/date-range/date-range.component";

@Component({
	selector: 'app-mp-reservation-orders-popup-date-provision',
	standalone: true,
	imports: [
		CardComponent,
		HeadlineComponent,
		IconComponent,
		DateTimePickerComponent,
		FormsModule,
		ReactiveFormsModule,
		TextComponent,
		ButtonComponent,
		TextareaComponent,
		DateRangeComponent,
	],
	templateUrl: './mp-reservation-orders-card-popup-change-provision-date.component.html',
	styleUrl: './mp-reservation-orders-card-popup-change-provision-date.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupChangeProvisionDateComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;

	public constructor(private readonly modalRef: ModalRef) {}

	protected close() {
		this.modalRef.close();
	}
}
