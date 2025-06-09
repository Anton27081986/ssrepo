import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonComponent,
	ButtonType,
	IconType,
	IconPosition,
	InputComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	CardComponent,
	FormFieldComponent,
} from '@front-components/components';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
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
	templateUrl: './mp-reservation-orders-card-popup-change-provision-date.component.html',
	styleUrl: './mp-reservation-orders-card-popup-change-provision-date.component.scss',
	standalone: true,
	imports: [
		NgIf,
		NgForOf,
		CardComponent,
		ButtonComponent,
		ButtonComponent,
		TextComponent,
		TextComponent,
		InputComponent,
		CardComponent,
		DateTimePickerComponent,
		FormFieldComponent,
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
		private readonly modalService: ModalService,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
	) {
		const initialRows: FormGroup<{ provisionDate: FormControl<string | null> }>[] =
			this.data.provisionDetails.map(() => this.createRow());

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
		const observables: Observable<void>[] = [];

		this.data.provisionDetails.forEach((detail, index) => {
			const newDateValue: string | null = this.rows.at(index).get('provisionDate')?.value;
			if (newDateValue && detail.id != null) {
				const obs$ = this.mpReservationOrderCardFacadeService.updateProvisionDateById(
					this.data.id,
					newDateValue,
					detail.id,
				);
				observables.push(obs$);
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
