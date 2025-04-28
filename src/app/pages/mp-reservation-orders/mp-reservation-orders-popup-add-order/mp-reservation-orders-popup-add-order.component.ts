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
	CardComponent,
	DropdownButtonComponent,
	FieldCtrlDirective,
	FormFieldComponent, IconPosition,
	IconType,
	InputComponent,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
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
		FormFieldComponent,
		SelectComponent,
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
	protected readonly length = length;

	protected addOrdersForm: FormGroup<{
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

	public selectedTov: IDictionaryItemDto | null = null;
	public selectedClient: IDictionaryItemDto | null = null;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
	) {
		this.addOrdersForm = new FormGroup({
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
	}

	public get accordionTitle(): string {
		const tovName = this.selectedTov?.name ?? '';
		const client = this.selectedClient?.name ?? '';
		const short = tovName.length > 50 ? `${tovName.slice(0, 50)}...` : tovName;
		return client ? `${short},\u00A0\u00A0\u00A0\u00A0${client}` : short;
	}

	// Геттер для доступа к FormArray позиций
	get positions(): FormArray {
		return this.addOrdersForm.get('positions') as FormArray;
	}

	private createPositionGroup(): FormGroup {
		const fullTitle = this.accordionTitle;
		const tovName = this.selectedTov?.name ?? '';
		return new FormGroup({
			headerTitle: new FormControl<string>(fullTitle),
			headerTovName: new FormControl<string>(tovName),
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

	public onTovSelect(item: IDictionaryItemDto) {
		this.selectedTov = item;
	}

	// Сюда придет выбранный клиент
	public onClientSelect(item: IDictionaryItemDto) {
		this.selectedClient = item;
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
		const currentAuthorId = this.selectedClient?.id ?? 0;

		const orderItems: IOrderItemsTypes[] = (formValues.positions || []).map(position => ({
			tovId: this.selectedTov?.id ?? 0,
			clientId: this.selectedClient?.id ?? 0,
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
		this.modalRef.close(orderData);
	}

	protected readonly IconPosition = IconPosition;
}
