import { Component, Inject } from '@angular/core';
import {
	FormGroup,
	FormControl,
	FormArray,
	ReactiveFormsModule,
} from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
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
} from '@front-components/components';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { NgForOf, DatePipe } from '@angular/common';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IProvisionDetailsTypes } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { forkJoin, Observable } from 'rxjs';

interface IProvisionDatePopupData {
	id: number;
	provisionDetails: IProvisionDetailsTypes[];
}

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-change-provision-date',
	templateUrl:
		'./mp-reservation-orders-card-popup-change-provision-date.component.html',
	styleUrl:
		'./mp-reservation-orders-card-popup-change-provision-date.component.scss',
	standalone: true,
	imports: [
		NgForOf,
		CardComponent,
		ButtonComponent,
		TextComponent,
		CardComponent,
		DateTimePickerComponent,
		CardComponent,
		ReactiveFormsModule,
		DatePipe,
	],
})
export class MpReservationOrdersCardPopupChangeProvisionDateComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public provisionDateForm: FormGroup<{
		rows: FormArray<
			FormGroup<{
				provisionDate: FormControl<string | null>;
			}>
		>;
	}>;

	constructor(
		@Inject(DIALOG_DATA) protected readonly data: IProvisionDatePopupData,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
	) {
		const initialRows: Array<
			FormGroup<{ provisionDate: FormControl<string | null> }>
		> = this.data.provisionDetails.map(() => this.createRow());

		this.provisionDateForm = new FormGroup({
			rows: new FormArray(initialRows),
		});
	}

	public get rows(): FormArray {
		return this.provisionDateForm.get('rows') as FormArray;
	}

	private createRow(): FormGroup {
		return new FormGroup({
			provisionDate: new FormControl<string | null>(null),
		});
	}

	public close(): void {
		this.modalRef.close();
	}

	public confirmChange(): void {
		const observables: Array<Observable<void>> = [];

		this.data.provisionDetails.forEach((detail, index) => {
			const newDateValue: string | null = this.rows
				.at(index)
				.get('provisionDate')
				?.value.split('T')[0];

			if (newDateValue && detail.id != null) {
				const updatesDates$ =
					this.mpReservationOrderCardFacadeService.updateProvisionDateById(
						this.data.id,
						newDateValue,
						detail.id,
					);

				observables.push(updatesDates$);
			}
		});

		if (observables.length === 0) {
			this.modalRef.close();
			this.mpReservationOrderCardFacadeService.reloadOrder();

			return;
		}

		forkJoin(observables).subscribe(() => {
			this.modalRef.close();
			this.mpReservationOrderCardFacadeService.reloadOrder();
		});
	}
}
