import { Component } from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonComponent,
	ButtonType,
	IconType,
	IconPosition,
	InputComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	CardComponent,
	FormFieldComponent,
} from '@front-components/components';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { NgIf, NgForOf } from '@angular/common';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-change-provision-date',
	templateUrl: './mp-reservation-orders-card-popup-change-provision-date.component.html',
	styleUrl: './mp-reservation-orders-card-popup-change-provision-date.component.scss',
	standalone: true,
	imports: [
		NgIf,
		NgForOf,
		CardComponent,
		ButtonComponent,
		ButtonComponent,
		TextComponent,
		TextComponent,
		InputComponent,
		CardComponent,
		DateTimePickerComponent,
		FormFieldComponent,
		CardComponent,
		ReactiveFormsModule,
	],
})
export class MpReservationOrdersCardPopupChangeProvisionDateComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public provisionDateForm: FormGroup<{
		rows: FormArray<
			FormGroup<{
				provisionDate: FormControl<string | null>;
			}>
		>;
	}>;

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
	) {
		this.provisionDateForm = new FormGroup({
			rows: new FormArray([this.createRow()]),
		});
	}

	public get rows(): FormArray {
		return this.provisionDateForm.get('rows') as FormArray;
	}

	private createRow(): FormGroup {
		return new FormGroup({
			provisionDate: new FormControl<string | null>(null, [Validators.required]),
		});
	}

	public close(): void {
		this.modalRef.close();
	}

	public confirmChange(): void {
		if (this.provisionDateForm.valid) {
			console.log('Изменяем даты обеспечения:', this.provisionDateForm.value);
			this.modalRef.close();
		} else {
			console.warn('Форма невалидна');
		}
	}
}
