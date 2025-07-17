import {Component, Signal} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import {
	FormArray,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
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
import { NgForOf } from '@angular/common';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { forkJoin } from 'rxjs';
import {IMpReservationOrder, IProvisionDetailsTypes} from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import {toSignal} from "@angular/core/rxjs-interop";

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-card-popup-order-in-production',
	templateUrl:
		'./mp-reservation-orders-card-popup-order-in-production.component.html',
	styleUrls: [
		'./mp-reservation-orders-card-popup-order-in-production.component.scss',
	],
	standalone: true,
	imports: [
		CardComponent,
		ButtonComponent,
		TextComponent,
		InputComponent,
		NgForOf,
		DateTimePickerComponent,
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
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly InputType = InputType;

	public order: Signal<IMpReservationOrder | null> = toSignal(
		this.facade.activeOrder$,
		{
			initialValue: null,
		},
	);

	public inProductionForm!: FormGroup<{
		quantity: FormControl<number | null>;
		manager: FormControl<string | null>;
		dates: FormArray<
			FormGroup<{
				productionDate: FormControl<string | null>;
				provisionDate: FormControl<string | null>;
				manufacturingAmount: FormControl<number | null>;
			}>
		>;
	}>;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly facade: MpReservationOrderCardFacadeService,
	) {
		this.inProductionForm = new FormGroup({
			manager: new FormControl<string>(this.order()!.author.name, [Validators.required]),
			quantity: new FormControl<number | null>(this.order()!.totalAmount, [Validators.required]),
			dates: new FormArray<
				FormGroup<{
					productionDate: FormControl<string | null>;
					provisionDate: FormControl<string | null>;
					manufacturingAmount: FormControl<number | null>;
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
			productionDate: new FormControl<string | null>(null, [
				Validators.required,
			]),
			provisionDate: new FormControl<string | null>(null, [
				Validators.required,
			]),
			manufacturingAmount: new FormControl<number | null>(null, [
				Validators.required,
			]),
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

		if (!this.inProductionForm.valid) {
			return;
		}

		const detailsList: IProvisionDetailsTypes[] = this.dates.controls.map(
			(group) => {
				const { productionDate, provisionDate, manufacturingAmount } =
					group.value as any;

				return {
					productionDate,
					provisionDate,
					manufacturingAmount,
				};
			},
		);

		this.facade
			.addDetails(detailsList)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.facade.reloadOrder();
				this.modalRef.close();
			});
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
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((status) => {
				if (!status) {
					this.modalRef.close();
				}
			});
	}
}
