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
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { SafeNumberConversion } from '@app/core/utils/safe-number-conversion.util';
import { switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {
	AddOrderFormGroup,
	OrderPositionFormGroup,
	OrderDetailFormGroup,
} from './mp-reservation-orders-popup-add-order.types';
import { MpReservationOrdersMapperService } from './mp-reservation-orders-mapper.service';

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
	protected addOrdersForm: AddOrderFormGroup;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly userFacadeService: UserFacadeService,
		private readonly mapperService: MpReservationOrdersMapperService
	) {
		this.addOrdersForm = this.createForm();

		this.userFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => {
				this.currentUser = user;
			});
	}

	public get accordionTitle(): string {
		const tovName = this.addOrdersForm.controls.tov.value?.name ?? '';
		const client = this.addOrdersForm.controls.client.value?.name ?? '';
		const short =
			tovName.length > 50 ? `${tovName.slice(0, 50)}...` : tovName;

		return client ? `${short},\u00A0\u00A0\u00A0\u00A0${client}` : short;
	}

	public get positions(): FormArray<OrderPositionFormGroup> {
		return this.addOrdersForm.controls.positions;
	}

	public createOrder(): void {
		this.setErrorsControl();
		this.addOrdersForm.markAllAsTouched();

		if (!this.addOrdersForm.valid) {
			return;
		}

		// Функциональный пайп вместо try/catch
		this.mapperService
			.buildAddOrderPayload$(this.addOrdersForm, this.currentUser)
			.pipe(
				switchMap((payload) =>
					this.mpReservationOrdersFacadeService.createOrder(payload)
				),
				tap((payload) => this.modalRef.close(payload)),
				untilDestroyed(this)
			)
			.subscribe({
				error: (error) => {
					console.error('Failed to create order:', error);
					// Здесь можно добавить показ toast/snackbar
				},
			});
	}

	public onTovSelect(item: IDictionaryItemDto): void {
		this.addOrdersForm.controls.tov.setValue(item);
	}

	public onClientSelect(item: IDictionaryItemDto): void {
		this.addOrdersForm.controls.client.setValue(item);
	}

	public getDetails(
		position: AbstractControl
	): FormArray<OrderDetailFormGroup> {
		return position.get('details') as FormArray<OrderDetailFormGroup>;
	}

	public addPosition(): void {
		this.setErrorsControl();
		this.addOrdersForm.markAllAsTouched();

		if (!this.addOrdersForm.valid) {
			return;
		}

		this.positions.push(this.createPositionGroup());
	}

	public removePosition(posIndex: number): void {
		this.positions.removeAt(posIndex);
	}

	public addDetailRow(posIndex: number): void {
		const details = this.positions.at(posIndex).controls.details;
		details.push(this.createDetailGroup());
	}

	public removeDetailRow(posIndex: number, detailIndex: number): void {
		const details = this.positions.at(posIndex).controls.details;
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

	private createForm(): AddOrderFormGroup {
		return new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			client: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			positions: new FormArray<OrderPositionFormGroup>([]),
		});
	}

	private createPositionGroup(): OrderPositionFormGroup {
		const tov = this.addOrdersForm.controls.tov.value;
		const client = this.addOrdersForm.controls.client.value;

		return new FormGroup({
			headerTitle: new FormControl<string>(this.accordionTitle, {
				nonNullable: true,
			}),
			headerTovName: new FormControl<string>(tov?.name ?? '', {
				nonNullable: true,
			}),
			tovId: new FormControl<number | null>(
				SafeNumberConversion.toId(tov?.id, {
					fieldName: 'tovId',
					required: false,
				})
			),
			clientId: new FormControl<number | null>(
				SafeNumberConversion.toId(client?.id, {
					fieldName: 'clientId',
					required: false,
				})
			),
			details: new FormArray<OrderDetailFormGroup>([
				this.createDetailGroup(),
			]),
		});
	}

	private createDetailGroup(): OrderDetailFormGroup {
		return new FormGroup({
			quantity: new FormControl<number | null>(null, [
				Validators.required,
			]),
			date: new FormControl<string | null>(null, [Validators.required]),
		});
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(this.addOrdersForm.controls.tov);
		this.setErrorsIfNotControlValue(this.addOrdersForm.controls.client);

		if (!this.positions.length) {
			return;
		}

		this.positions.controls.forEach((positionGroup) => {
			const details = positionGroup.controls.details;

			if (!details.length) {
				return;
			}

			details.controls.forEach((detailGroup) => {
				const dateCtrl = detailGroup.controls.date;
				this.setErrorsIfNotControlValue(dateCtrl);
			});
		});
	}
}
