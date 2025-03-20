import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
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
	],
	templateUrl: './mp-reservation-orders-popup-date-provision.component.html',
	styleUrl: './mp-reservation-orders-popup-date-provision.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersPopupDateProvisionComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;

	public constructor(private readonly modalRef: ModalRef) {}

	protected close() {
		this.modalRef.close();
	}
}
