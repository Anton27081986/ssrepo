import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
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
	Size,
	TextType,
	TextWeight,
} from '@front-components/components';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { NgForOf } from '@angular/common';
import { MpReservationOrdersCardPopupQualificationTrComponent } from './mp-reservation-orders-card-popup-qualification-tr/mp-reservation-orders-card-popup-qualification-tr.component';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IOrderRequests } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IOrderChangeQualification } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-qualification';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IClarifyOrder } from './mp-reservation-orders-card-popup-qualification.models';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { ModalService } from '@app/core/modal/modal.service';

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
		FormsModule,
		ReactiveFormsModule,
		ButtonComponent,
		CardComponent,
		TableV2Component,
		NgForOf,
		MpReservationOrdersCardPopupQualificationTrComponent,
		SearchInputComponent,
	],
	templateUrl:
		'./mp-reservation-orders-card-popup-qualification.component.html',
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

	public readonly MAX_ROWS = 10;

	protected items: IOrderChangeQualification[] = [];
	protected tov?: IFilterOption;
	protected id?: number;

	public changeClarifyOrderForm: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
	}>;

	constructor(
		@Inject(DIALOG_DATA) private readonly data: IQualificationData,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
		private readonly modalService: ModalService
	) {
		if (data) {
			this.items = this.data.items.map((item) => {
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
				{ id: this.data.tov.id, name: this.data.tov.name },
				[Validators.required]
			),
		});
	}

	private createEmptyItem(): IOrderChangeQualification {
		return {
			amount: 0,
			requestedProvisionDate: '',
			errors: {}
		};
	}

	public addRow(): void {
		if (this.items.length >= this.MAX_ROWS) {
			return;
		}
		this.items = [...this.items, this.createEmptyItem()];
	}

	public removeRow(index: number): void {
		if (this.items.length <= 1) {
			return;
		}
		this.items = this.items.filter((_, i) => i !== index);
	}

	public trackByItem(index: number): number {
		return index;
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
		this.setErrorsIfNotControlValue(
			this.changeClarifyOrderForm.controls.tov
		);
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	public clarifyOrder(): void {
		this.setErrorsControl();
		this.changeClarifyOrderForm.markAllAsTouched();

		let invalidRows = false;

		this.items.forEach((item) => {
			item.errors.amount = !item.amount;
			item.errors.requestedProvisionDate = !item.requestedProvisionDate;
			invalidRows =
				invalidRows ||
				item.errors.amount ||
				item.errors.requestedProvisionDate;
		});

		if (invalidRows || this.changeClarifyOrderForm.invalid) {
			return;
		}

		const body: IClarifyOrder = {
			tovId: this.tov!.id,
			requests: this.items.map((item) => {
				const itemDate = new Date(item.requestedProvisionDate);
				const year = itemDate.getFullYear();
				const month = String(itemDate.getMonth() + 1).padStart(2, '0');
				const day = String(itemDate.getDate()).padStart(2, '0');
				const isoItemDate = `${year}-${month}-${day}T00:00:00.000Z`;

				return {
					requestedProvisionDate: isoItemDate,
					amount: item.amount,
				};
			}),
		};

		this.mpReservationOrderCardFacadeService
			.clarifyOrder(body)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close(true);
				this.mpReservationOrderCardFacadeService.reloadOrder();
			});
	}

	protected close(): void {
		this.modalRef.close();
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
