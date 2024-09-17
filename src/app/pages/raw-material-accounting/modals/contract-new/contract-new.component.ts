import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { RawMaterialAccountingFacadeService } from '@app/core/facades/raw-material-accounting-facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

@UntilDestroy()
@Component({
	selector: 'ss-contract-new',
	templateUrl: './contract-new.component.html',
	styleUrls: ['./contract-new.component.scss'],
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
			quantityTotal: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
			price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
			period: new FormControl<string>('', Validators.required),
			paymentConditions: new FormControl<string>('', Validators.required),
			deliveryConditions: new FormControl<string>('', Validators.required),
			notificationDate: new FormControl<string>(
				new Date().toLocaleString('ru-RU', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				}),
				Validators.required,
			),
		});

		this.contractDetails$ = this.facadeService.contractDetails$;
	}

	addContract() {
		this.newContractForm.markAllAsTouched();

		for (const field in this.newContractForm.controls) {
			if (this.newContractForm.get(field)?.errors) {
				return;
			}
		}

		const dates = fromPickerRangeDateToIso(this.newContractForm.value.period);
		const newContract: AddContractDto = {
			...this.newContractForm.value,
			contractorId: this.newContractForm.value.contractor.id,
			notificationDate: fromPickerDateToIso(this.newContractForm.value.notificationDate),
			periodStartDate: dates[0],
			periodEndDate: dates[1],
		};

		this.facadeService
			.addContract(newContract)
			.pipe(untilDestroyed(this))
			.subscribe(contract => {
				this.modalRef.close(contract);
			});
	}

	onContractorSelect(id: string) {
		this.facadeService.getContractDetails(id);
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
