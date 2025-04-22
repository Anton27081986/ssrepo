import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule, Validators,
} from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	CardComponent, FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	Size,
	TextareaComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';

@Component({
	selector: 'app-mp-reservation-orders-card-popup-reject-order',
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
		TextareaComponent,
		FormFieldComponent,
		FieldCtrlDirective,
	],
	templateUrl: './mp-reservation-orders-card-popup-reject-order.component.html',
	styleUrl: './mp-reservation-orders-card-popup-reject-order.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupRejectOrderComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;

	public declineForm: FormGroup<{
		comment: FormControl<string | null>;
	}>;

	public constructor(private readonly modalRef: ModalRef) {
		this.declineForm = new FormGroup({
			comment: new FormControl<string | null>(null, [Validators.required]),
		});
	}

	protected close() {
		this.modalRef.close();
	}
}
