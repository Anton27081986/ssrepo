import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { RawMaterialAccountingFacadeService } from '@app/core/facades/raw-material-accounting-facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { AddContractDto } from '@app/core/models/raw-material-accounting/add-contract-dto';
import {
	fromPickerDateToIso,
	fromPickerRangeDateToIso,
} from '@app/shared/pipe/from-picker-date-to-iso';
import { ModalService } from '@app/core/modal/modal.service';
import { ConfirmationModalComponent } from '@app/components/modal/confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {SelectComponent} from "@app/shared/components/select/select.component";
import {DateRangeComponent} from "@app/shared/components/inputs/date-range/date-range.component";
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {DatepickerInputComponent} from "@app/shared/components/inputs/datepicker-input/datepicker-input.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

@UntilDestroy()
@Component({
	selector: 'ss-contract-new',
	templateUrl: './contract-new.component.html',
	styleUrls: ['./contract-new.component.scss'],
	imports: [
		CardComponent,
		HeadlineComponent,
		IconComponent,
		ReactiveFormsModule,
		InputComponent,
		SearchInputComponent,
		SelectComponent,
		DateRangeComponent,
		TextareaComponent,
		DatepickerInputComponent,
		ButtonComponent
	],
	standalone: true
})
export class ContractNewComponent {
	public newContractForm!: FormGroup;
	public contractDetails$: Observable<IResponse<IDictionaryItemDto>>;
	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly facadeService: RawMaterialAccountingFacadeService,
	) {
		this.newContractForm = new FormGroup({
			contractNumber: new FormControl<string>('', [Validators.required]),
			contractor: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			contractDetailId: new FormControl<number | null>(null, [Validators.required]),
			quantityTotal: new FormControl<number | null>(null, [
				Validators.required,
				Validators.min(1),
				Validators.max(99999999999),
			]),
			price: new FormControl<number | null>(null, [
				Validators.min(1),
				Validators.max(99999999999),
			]),
			period: new FormControl<string>('', Validators.required),
			paymentConditions: new FormControl<string>(''),
			deliveryConditions: new FormControl<string>(''),
			notificationDate: new FormControl<string>(''),
			tradePosition: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
		});

		this.contractDetails$ = this.facadeService.contractDetails$;
	}

	addContract() {
		this.newContractForm.markAllAsTouched();

		if (!this.newContractForm.value.period) {
			return;
		}

		const dates = fromPickerRangeDateToIso(this.newContractForm.value.period);

		if (!dates[0] || !dates[1]) {
			this.newContractForm.controls.period.setErrors({ period: true });
		}

		for (const field in this.newContractForm.controls) {
			if (this.newContractForm.get(field)?.errors) {
				return;
			}
		}

		const newContract: AddContractDto = {
			...this.newContractForm.value,
			contractorId: this.newContractForm.value.contractor.id,
			notificationDate: this.newContractForm.value.notificationDate
				? fromPickerDateToIso(this.newContractForm.value.notificationDate)
				: null,
			periodStartDate: dates[0],
			periodEndDate: dates[1],
			tovId: this.newContractForm.value.tradePosition.id,
		};

		this.facadeService
			.addContract(newContract)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close(true);
			});
	}

	onContractorSelect(id: number) {
		this.facadeService.getContractDetails(id);
	}

	selectSearchItem(item: IDictionaryItemDto | null, ctrl: AbstractControl) {
		ctrl.setValue(item);
		ctrl.markAsTouched();
	}

	close() {
		this.modalService
			.open(ConfirmationModalComponent, {
				data: {
					title: 'Изменения не будут сохранены',
					text:
						'Вы покидаете форму создания контракта \n' +
						'без сохранения данных. Контракт не будет добавлен.',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}
}
