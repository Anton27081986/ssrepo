import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import {
	FormControl,
	FormGroup,
	FormArray,
	Validators,
	ReactiveFormsModule,
	AbstractControl,
} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	InputType,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import { NgTemplateOutlet, NgForOf, NgIf } from '@angular/common';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import {
	IMpReservationAddOrder,
	IOrderItemsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-add-order',
	templateUrl: './mp-reservation-orders-popup-add-order.component.html',
	styleUrls: ['./mp-reservation-orders-popup-add-order.component.scss'],
	imports: [
		CardComponent,
		InputComponent,
		ButtonComponent,
		TextComponent,
		AccordionComponent,
		NgTemplateOutlet,
		NgForOf,
		ReactiveFormsModule,
		NgIf,
		DateTimePickerComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		SearchInputComponent,
		TooltipDirective,
	],
	standalone: true,
})
export class MpReservationOrdersPopupAddOrderComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly IconType = IconType;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly IconPosition = IconPosition;
	protected readonly InputType = InputType;

	public currentUser: IUserProfile | null | undefined;

	protected addOrdersForm: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
		contractor: FormControl<IDictionaryItemDto | null>;
		positions: FormArray<
			FormGroup<{
				headerTitle: FormControl<string>;
				headerTovName: FormControl<string>;
				details: FormArray<
					FormGroup<{
						quantity: FormControl<number | null>;
						date: FormControl<string | null>;
					}>
				>;
			}>
		>;
	}>;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly userFacadeService: UserFacadeService
	) {
		this.addOrdersForm = new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			contractor: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			positions: new FormArray<
				FormGroup<{
					headerTitle: FormControl<string>;
					headerTovName: FormControl<string>;
					details: FormArray<
						FormGroup<{
							quantity: FormControl<number | null>;
							date: FormControl<string | null>;
						}>
					>;
				}>
			>([]),
		});

		this.userFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => {
				this.currentUser = user;
			});
	}

	public get accordionTitle(): string {
		const tovName = this.addOrdersForm.controls.tov.value?.name ?? '';
		const contractor = this.addOrdersForm.controls.contractor.value?.name ?? '';
		const short =
			tovName.length > 50 ? `${tovName.slice(0, 50)}...` : tovName;

		return contractor ? `${short},\u00A0\u00A0\u00A0\u00A0${contractor}` : short;
	}

	// Геттер для доступа к FormArray позиций
	public get positions(): FormArray {
		return this.addOrdersForm.get('positions') as FormArray;
	}

	private createPositionGroup(): FormGroup<{
		tovId: FormControl<number | null>;
		contractorId: FormControl<number | null>;
		details: FormArray<
			FormGroup<{
				quantity: FormControl<number | null>;
				date: FormControl<string | null>;
			}>
		>;
		headerTovName: FormControl<string | null>;
		headerTitle: FormControl<string | null>;
	}> {
		// берём к текущему моменту выбранные вверху значения
		const tov = this.addOrdersForm.controls.tov.value;
		const contractor = this.addOrdersForm.controls.contractor.value;

		return new FormGroup({
			headerTitle: new FormControl<string>(this.accordionTitle),
			headerTovName: new FormControl<string>(tov?.name ?? ''),
			tovId: new FormControl<number>(tov?.id ?? 0),
			contractorId: new FormControl<number>(contractor?.id ?? 0),
			details: new FormArray([this.createDetailGroup()]),
		});
	}

	// Создаем новую строку в таблице деталей
	private createDetailGroup(): FormGroup {
		return new FormGroup({
			quantity: new FormControl<number | null>(null, [
				Validators.required,
			]),
			date: new FormControl<string | null>(null, [Validators.required]),
		});
	}

	public onTovSelect(item: IDictionaryItemDto): void {
		this.addOrdersForm.controls.tov.setValue(item);
	}

	// Сюда придет выбранный клиент
	public onClientSelect(item: IDictionaryItemDto): void {
		this.addOrdersForm.controls.contractor.setValue(item);
	}

	public getDetails(position: AbstractControl): FormArray {
		return position.get('details') as FormArray;
	}

	// Добавляем новый accordion (новую товарную позицию)
	public addPosition(): void {
		this.setErrorsControl();
		this.addOrdersForm.markAllAsTouched();

		if (!this.addOrdersForm.valid) {
			return;
		}

		this.positions.push(this.createPositionGroup());
	}

	// Удаление позиции (accordion) по индексу
	public removePosition(posIndex: number): void {
		this.positions.removeAt(posIndex);
	}

	// Добавление новой строки в таблице деталей внутри позиции
	public addDetailRow(posIndex: number): void {
		const details = this.positions.at(posIndex).get('details') as FormArray;

		details.push(this.createDetailGroup());
	}

	// Удаление строки в таблице деталей внутри позиции
	public removeDetailRow(posIndex: number, detailIndex: number): void {
		const details = this.positions.at(posIndex).get('details') as FormArray;

		details.removeAt(detailIndex);
	}

	protected close(): void {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Данные не будут сохранены',
					text: 'Вы уверены, что хотите уйти?',
				},
			})
			.afterClosed()
			.subscribe((status) => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(this.addOrdersForm.controls.tov);
		this.setErrorsIfNotControlValue(this.addOrdersForm.controls.contractor);

		const positions = this.addOrdersForm.get('positions') as FormArray;

		if (!positions.length) {
			return;
		}

		positions.controls.forEach((positionGroup) => {
			const details = (positionGroup as FormGroup).get(
				'details'
			) as FormArray;

			if (!details.length) {
				return;
			}

			details.controls.forEach((detailGroup) => {
				const fg = detailGroup as FormGroup;
				const dateCtrl = fg.get('date') as FormControl;

				this.setErrorsIfNotControlValue(dateCtrl);
			});
		});
	}

	public createOrder(): void {
		this.setErrorsControl();
		this.addOrdersForm.markAllAsTouched();

		if (!this.addOrdersForm.valid) {
			return;
		}

		const orderItems: IOrderItemsTypes[] = this.positions.controls.map(
			(newAddOrdersForm) => {
				const group = newAddOrdersForm as FormGroup;
				const tovId = group.get('tovId')!.value;
				const contractorId = group.get('contractorId')!.value;
				const requests = (
					group.get('details') as FormArray
				).controls.map((newDetailsGroup) => {
					const detailsGroup = newDetailsGroup as FormGroup;

					return {
						requestedProvisionDate:
							detailsGroup.get('date')!.value ?? '',
						amount: detailsGroup.get('quantity')!.value ?? 0,
					};
				});

				return { tovId, contractorId, orderRequests: requests };
			}
		);

		const payload: IMpReservationAddOrder = {
			authorId: this.currentUser?.id ?? 0,
			items: orderItems,
		};

		this.mpReservationOrdersFacadeService
			.createOrder(payload)
			.subscribe(() => {
				this.modalRef.close(payload);
			});
	}
}
