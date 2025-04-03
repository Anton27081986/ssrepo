import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy } from '@ngneat/until-destroy';
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
	DropdownButtonComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { NgTemplateOutlet, NgForOf, NgIf } from '@angular/common';
import { InputComponent } from '@app/shared/components/inputs/input/input.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import {
	IMpReservationAddOrder,
	IOrderItemsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-add-order',
	templateUrl: './mp-reservation-orders-popup-add-order.component.html',
	styleUrls: ['./mp-reservation-orders-popup-add-order.component.scss'],
	imports: [
		CardComponent,
		IconComponent,
		SelectV2Component,
		InputComponent,
		ButtonComponent,
		TextComponent,
		DropdownButtonComponent,
		AccordionComponent,
		TabsComponent,
		NgTemplateOutlet,
		NgForOf,
		ReactiveFormsModule,
		NgIf,
		DateTimePickerComponent,
	],
	standalone: true,
})
export class MpReservationOrdersPopupAddOrderComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly length = length;

	protected addOrdersForm: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
		client: FormControl<IDictionaryItemDto | null>;
		positions: FormArray<
			FormGroup<{
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
	) {
		this.addOrdersForm = new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			client: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			positions: new FormArray<
				FormGroup<{
					details: FormArray<
						FormGroup<{
							quantity: FormControl<number | null>;
							date: FormControl<string | null>;
						}>
					>;
				}>
			>([]),
		});
	}

	get tovValue(): IDictionaryItemDto | null {
		return this.addOrdersForm.controls.tov.value;
	}

	// Геттер для доступа к FormArray позиций
	get positions(): FormArray {
		return this.addOrdersForm.get('positions') as FormArray;
	}

	// Создаем новый FormGroup для позиции (новый accordion)
	private createPositionGroup(): FormGroup {
		return new FormGroup({
			details: new FormArray([this.createDetailGroup()]),
		});
	}

	// Создаем новую строку в таблице деталей
	private createDetailGroup(): FormGroup {
		return new FormGroup({
			quantity: new FormControl<number | null>(null, [Validators.required]),
			date: new FormControl<string | null>(null),
		});
	}

	public getDetails(position: AbstractControl): FormArray {
		return position.get('details') as FormArray;
	}

	// Добавляем новый accordion (новую товарную позицию)
	public addPosition(): void {
		this.positions.push(this.createPositionGroup());
	}

	// Удаление позиции (accordion) по индексу
	public removePosition(posIndex: number): void {
		this.positions.removeAt(posIndex);
	}

	// Добавление новой строки в таблице деталей внутри позиции
	public addDetailRow(posIndex: number): void {
		console.log(posIndex);
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
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	public createOrder(): void {
		const formValues = this.addOrdersForm.value;
		const currentAuthorId = formValues.client?.id ?? 0;

		const orderItems: IOrderItemsTypes[] = (formValues.positions || []).map(position => ({
			tovId: formValues.tov?.id ?? 0,
			clientId: formValues.client?.id ?? 0,
			orderRequests: (position.details || []).map(detail => ({
				requestedProvisionDate: detail.date ?? '',
				amount: detail.quantity ?? 0,
			})),
		}));

		const orderData: IMpReservationAddOrder = {
			authorId: currentAuthorId,
			items: orderItems,
		};

		this.mpReservationOrdersFacadeService.createOrder(orderData);
		this.modalRef.close();
	}
}
