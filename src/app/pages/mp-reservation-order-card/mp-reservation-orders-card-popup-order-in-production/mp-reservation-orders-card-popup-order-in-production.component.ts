import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	IconType,
	IconPosition,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	CardComponent,
	InputComponent,
	TooltipTheme,
	TooltipPosition,
	InputType,
	FieldCtrlDirective,
	FormFieldComponent,
} from '@front-components/components';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { NgForOf, NgIf } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import {NoticeDialogComponent} from "@app/shared/components/notice-dialog/notice-dialog.component";

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-card-popup-order-in-production',
	templateUrl: './mp-reservation-orders-card-popup-order-in-production.component.html',
	styleUrls: ['./mp-reservation-orders-card-popup-order-in-production.component.scss'],
	standalone: true,
	imports: [
		CardComponent,
		IconComponent,
		ButtonComponent,
		TextComponent,
		InputComponent,
		NgForOf,
		NgIf,
		DateTimePickerComponent,
		IconComponent,
		ReactiveFormsModule,
		CardComponent,
		FieldCtrlDirective,
		FormFieldComponent,
	],
})
export class MpReservationOrdersCardPopupOrderInProductionComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public inProductionForm!: FormGroup<{
		quantity: FormControl<number | null>;
		manager: FormControl<string | null>;
		dates: FormArray<
			FormGroup<{
				productionDate: FormControl<string | null>;
				provisionDate: FormControl<string | null>;
				fact: FormControl<number | null>;
			}>
		>;
	}>;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
	) {
		this.inProductionForm = new FormGroup({
			manager: new FormControl<string>('Борисова А.В.'), // Для примера, если нужно выводить менеджера
			quantity: new FormControl<number | null>(300, [Validators.required]), // Пример
			dates: new FormArray<
				FormGroup<{
					productionDate: FormControl<string | null>;
					provisionDate: FormControl<string | null>;
					fact: FormControl<number | null>;
				}>
			>([]),
		});
		this.addDatesRow();
	}

	public get dates(): FormArray {
		return this.inProductionForm.get('dates') as FormArray;
	}

	private createDatesGroup(): FormGroup {
		return new FormGroup({
			productionDate: new FormControl<string | null>(null),
			provisionDate: new FormControl<string | null>(null),
			fact: new FormControl<number | null>(200), // Для примера
		});
	}

	public addDatesRow(): void {
		this.dates.push(this.createDatesGroup());
	}

	public removeDatesRow(index: number): void {
		this.dates.removeAt(index);
	}

	public close(): void {
		this.modalRef.close();
	}

	public placeOrder(): void {
		if (this.inProductionForm.valid) {
			console.log('Размещение в производстве:', this.inProductionForm.value);
			this.modalRef.close();
		} else {
			console.warn('Форма невалидна');
		}
	}

	public openPopupCancelAction(): void {
		this.modalService
			.open(NoticeDialogComponent, {
				data: {
					header: 'Изменения не будут сохранены',
					text: 'Вы уверены, что хотите совершить действие',
					type: 'Warning',
					buttonOk: 'Отмена',
					buttonCancel: 'Не сохранять',
				},
			})
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly InputType = InputType;
}
