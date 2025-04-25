import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
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
import {MpReservationOrderCardFacadeService} from "@app/core/facades/mp-reservation-order-card-facade.service";
import {forkJoin} from "rxjs";
import {IProvisionDetailsTypes} from "@app/core/models/mp-reservation-orders/mp-reservation-order";

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
		private readonly facade: MpReservationOrderCardFacadeService
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

	public get dates(): FormArray<
		FormGroup<{
			productionDate: FormControl<string | null>;
			provisionDate: FormControl<string | null>;
			fact: FormControl<number | null>;
		}>
	> {
		return this.inProductionForm.get('dates') as FormArray<
			FormGroup<{
				productionDate: FormControl<string | null>;
				provisionDate: FormControl<string | null>;
				fact: FormControl<number | null>;
			}>
		>;
	}

	private createDatesGroup(): FormGroup {
		return new FormGroup({
			productionDate: new FormControl<string | null>(null, [Validators.required]),
			provisionDate: new FormControl<string | null>(null, [Validators.required]),
			fact: new FormControl<number | null>(null, [Validators.required]), // Для примера
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
		this.inProductionForm.markAllAsTouched();
		if (this.inProductionForm.valid) {
			forkJoin(
				this.dates.controls.map((form)=> {
					return this.facade.addDetails(form.value as IProvisionDetailsTypes);
				})
			).pipe(untilDestroyed(this)).subscribe(()=>{
				this.facade.reloadOrder();
				this.modalRef.close();
			})
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
			}).afterClosed().pipe(untilDestroyed(this)).subscribe(status => {
				if (!status) {
					this.modalRef.close()
				}
		})
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
