import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconPosition,
	IconType,
	IDictionaryItemDto,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { TableComponent } from '@app/shared/components/table/table.component';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { AtWorkRowItemTrComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-row-item-tr/at-work-row-item-tr.component';
import { NgForOf } from '@angular/common';
import { MpReservationOrdersCardPopupQualificationTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification-tr/mp-reservation-orders-card-popup-qualification-tr.component';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IOrderChangeQualification } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-qualification';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, take } from 'rxjs';
import {
	IMpReservationAddOrder,
	IOrderItemsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { IClarifyOrder } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification.models';

interface IQualificationData {
	id: number;
	items: IOrderRequests[];
	tov: IDictionaryItemDto;
}

@UntilDestroy()
@Component({
	selector: 'app-mp-reservation-orders-popup-qualification',
	standalone: true,
	imports: [
		CardComponent,
		HeadlineComponent,
		IconComponent,
		DateTimePickerComponent,
		FormsModule,
		ReactiveFormsModule,
		TextComponent,
		ButtonComponent,
		TextareaComponent,
		CardComponent,
		SelectComponent,
		SelectV2Component,
		TableComponent,
		TableV2Component,
		AtWorkRowItemTrComponent,
		NgForOf,
		MpReservationOrdersCardPopupQualificationTrComponent,
		SearchInputComponent,
	],
	templateUrl: './mp-reservation-orders-card-popup-qualification.component.html',
	styleUrl: './mp-reservation-orders-card-popup-qualification.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupQualificationComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;

	protected items: IOrderChangeQualification[] = [];
	protected tov?: IFilterOption;
	protected id?: number;

	public changeClarifyOrderForm: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
	}>;

	public constructor(
		@Inject(DIALOG_DATA) private readonly data: IQualificationData,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
	) {
		if (data) {
			this.items = this.data.items.map(item => {
				return {
					amount: item.amount,
					requestedProvisionDate: item.requestedProvisionDate,
					errors: {},
				};
			});

			this.tov = {
				id: this.data.tov.id,
				name: this.data.tov.name,
				checked: true,
			} as IFilterOption;
			this.id = this.data.id;
		}

		this.changeClarifyOrderForm = new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(
				{ id: this.data.tov.id, name: this.data.tov.name }, // ← начальное значение
				[Validators.required],
			),
		});
	}

	public onTovSelect(item: IDictionaryItemDto): void {
		this.tov = {
			id: Number(item.id),
			name: item.name,
			checked: true,
		};
		this.changeClarifyOrderForm.controls.tov.setValue(item);
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(this.changeClarifyOrderForm.controls.tov);
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	public clarifyOrder(): void {
		this.mpReservationOrderCardFacadeService.activeOrder$
			.pipe(take(1), map(o => o!.author.id))
			.subscribe(authorId => {
				const body: IClarifyOrder = {
					tovId: this.tov!.id,
					requests: {
						authorId,
						items: [
							{
								tovId: this.tov!.id,
								clientId: this.data.id,
								orderRequests: this.items.map(item => {
									const itemDate = new Date(item.requestedProvisionDate);
									const year  = itemDate.getFullYear();
									const month = String(itemDate.getMonth() + 1).padStart(2, '0');
									const day   = String(itemDate.getDate()).padStart(2, '0');
									const isoItemDate = `${year}-${month}-${day}T00:00:00.000Z`;

									return {
										requestedProvisionDate: isoItemDate,
										amount: item.amount,
									};
								}),
							} as IOrderItemsTypes,
						],
					} as IMpReservationAddOrder,
				};

				this.mpReservationOrderCardFacadeService
					.clarifyOrder(body)
					.pipe(untilDestroyed(this))
					.subscribe(() => this.modalRef.close(true));
			});
	}


	protected close() {
		this.modalRef.close();
	}
}
