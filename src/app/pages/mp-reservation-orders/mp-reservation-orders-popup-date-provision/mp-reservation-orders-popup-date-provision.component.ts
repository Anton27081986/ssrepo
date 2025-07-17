import { Component, Inject } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconType,
	IconPosition,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-date-provision',
	templateUrl: './mp-reservation-orders-popup-date-provision.component.html',
	styleUrls: ['./mp-reservation-orders-popup-date-provision.component.scss'],
	standalone: true,
	imports: [
		CardComponent,
		DateTimePickerComponent,
		ButtonComponent,
		TextComponent,
		ReactiveFormsModule,
	],
})
export class MpReservationOrdersPopupDateProvisionComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public provisionForm: FormGroup<{
		provisionDate: FormControl<string | null>;
	}>;

	constructor(
		@Inject(DIALOG_DATA) private readonly orderIds: Set<number>,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService
	) {
		this.provisionForm = new FormGroup({
			provisionDate: new FormControl<string | null>(null, [
				Validators.required,
			]),
		});
	}

	public close(): void {
		this.modalRef.close();
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(
			this.provisionForm.controls.provisionDate
		);
	}

	public onSetProvisionDate(): void {
		this.setErrorsControl();
		this.provisionForm.markAllAsTouched();

		if (this.provisionForm.invalid) {
			return;
		}

		const date = this.provisionForm.value.provisionDate!;

		this.mpReservationOrdersFacadeService.updateProvisionDates(
			Array.from(this.orderIds),
			date
		);
		this.modalRef.close();
	}
}
