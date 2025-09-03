import { Component, OnInit, Signal } from '@angular/core';
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
import { CardComponent } from '@front-components/components';
import { NgForOf } from '@angular/common';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import {
	IMpReservationOrder,
	IProvisionDetailsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	ButtonComponent,
	ButtonType,
	DatepickerComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	InputType,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';

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
		InputComponent,
		NgForOf,
		ReactiveFormsModule,
		FormFieldComponent,
		FormFieldComponent,
		InputComponent,
		CardComponent,
		TextComponent,
		ButtonComponent,
		FieldCtrlDirective,
		DatepickerComponent,
	],
})
export class MpReservationOrdersCardPopupOrderInProductionComponent
	implements OnInit
{
	public order: Signal<IMpReservationOrder | null> = toSignal(
		this.facade.activeOrder$,
		{
			initialValue: null,
		}
	);

	public inProductionForm!: FormGroup<{
		dates: FormArray<
			FormGroup<{
				productionDate: FormControl<Date | null>;
				provisionDate: FormControl<Date | null>;
				manufacturingAmount: FormControl<number | null>;
			}>
		>;
	}>;

	public minDate = new Date();

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly InputType = InputType;
	protected readonly ExtraSize = ExtraSize;
	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly facade: MpReservationOrderCardFacadeService
	) {}

	ngOnInit() {
		this.inProductionForm = new FormGroup({
			dates: new FormArray<
				FormGroup<{
					productionDate: FormControl<Date | null>;
					provisionDate: FormControl<Date | null>;
					manufacturingAmount: FormControl<number | null>;
				}>
			>([]),
		});
		this.addDatesRow();
	}

	public get dates(): FormArray<
		FormGroup<{
			productionDate: FormControl<Date | null>;
			provisionDate: FormControl<Date | null>;
			manufacturingAmount: FormControl<number | null>;
		}>
	> {
		return this.inProductionForm.get('dates') as FormArray<
			FormGroup<{
				productionDate: FormControl<Date | null>;
				provisionDate: FormControl<Date | null>;
				manufacturingAmount: FormControl<number | null>;
			}>
		>;
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
		const detailsList: IProvisionDetailsTypes[] = this.dates.controls.map(
			(group) => {
				return {
					productionDate: this.formatDate(
						group.value.productionDate!
					),
					provisionDate: this.formatDate(group.value.provisionDate!),
					manufacturingAmount: group.value.manufacturingAmount,
				} as IProvisionDetailsTypes;
			}
		);

		this.facade
			.addDetails(detailsList)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
				this.facade.reloadOrder();
			});
	}

	public openPopupApproveAction(): void {
		this.inProductionForm.markAllAsTouched();

		if (!this.inProductionForm.valid) {
			return;
		}

		this.modalService
			.open(NoticeDialogComponent, {
				data: {
					header: 'Вы уверены, что хотите совершить действие?',
					text: '  ',
					type: 'Warning',
					buttonOk: 'Отмена',
					buttonCancel: 'Подтвердить',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((status) => {
				if (!status) {
					this.placeOrder();
				} else {
					this.modalRef.close();
				}
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

	private formatDate(date: Date | null): string {
		if (!date) {
			return '';
		}

		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
}
