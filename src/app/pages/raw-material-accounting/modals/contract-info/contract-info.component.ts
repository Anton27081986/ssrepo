import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { RawMaterialAccountingFacadeService } from '@app/core/facades/raw-material-accounting-facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRawMaterialAccountingContract } from '@app/core/models/raw-material-accounting/contract';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Permissions } from '@app/core/constants/permissions.constants';
import {
	fromPickerDateToIso,
	fromPickerRangeDateToIso,
} from '@app/shared/pipe/from-picker-date-to-iso';
import { AddContractDto } from '@app/core/models/raw-material-accounting/add-contract-dto';

interface IDialogData {
	id?: string | null;
}

@UntilDestroy()
@Component({
	selector: 'ss-contract-info',
	templateUrl: './contract-info.component.html',
	styleUrls: ['./contract-info.component.scss'],
})
export class ContractInfoComponent {
	public contract: IRawMaterialAccountingContract | null = null;
	public canEdit: boolean = false;
	public isEditMode: boolean = false;

	public editForm!: FormGroup;
	constructor(
		private readonly modalRef: ModalRef,
		private readonly facadeService: RawMaterialAccountingFacadeService,
		@Inject(DIALOG_DATA) private readonly data: IDialogData,
	) {
		this.editForm = new FormGroup({
			quantityTotal: new FormControl<number>(0, [Validators.required]),
			price: new FormControl<number>(0, Validators.required),
			period: new FormControl<string>('', Validators.required),
			isComplete: new FormControl<boolean>(false),
			reasonCompletion: new FormControl<string>(''),
		});

		this.facadeService.selectedContract$.pipe(untilDestroyed(this)).subscribe(contract => {
			if (contract) {
				this.contract = contract.data;
				this.canEdit = contract.permissions.includes(Permissions.CLIENT_PROCUREMENTS_EDIT);

				this.contract.notificationDate = new Date(
					Date.parse(contract.data.notificationDate),
				).toLocaleString('ru-RU', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				});
				this.contract.periodStartDate = new Date(
					Date.parse(contract.data.periodStartDate),
				).toLocaleString('ru-RU', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				});
				this.contract.periodEndDate = new Date(
					Date.parse(contract.data.periodEndDate),
				).toLocaleString('ru-RU', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				});

				this.editForm.controls.quantityTotal.setValue(contract.data.quantityTotal);
				this.editForm.controls.price.setValue(contract.data.price);
				this.editForm.controls.period.setValue(
					`${this.contract.periodStartDate}-${this.contract.periodEndDate}`,
				);
				this.editForm.controls.reasonCompletion.setValue(
					contract.data.reasonCompletion || '',
				);
				this.editForm.controls.isComplete.setValue(contract.data.isComplete || false);
			}
		});

		if (data.id) {
			this.facadeService.selectContract(data.id);
		}
	}

	public saveContract() {
		this.editForm.markAllAsTouched();

		if (this.editForm.controls.isComplete && !this.editForm.controls.reasonCompletion.value) {
			this.editForm.controls.reasonCompletion.setErrors({ required: true });
		}

		for (const field in this.editForm.controls) {
			if (this.editForm.get(field)?.errors) {
				return;
			}
		}

		const dates = fromPickerRangeDateToIso(this.editForm.value.period);
		const newContract: AddContractDto = {
			...this.contract,
			...this.editForm.value,
			notificationDate: fromPickerDateToIso(this.contract!.notificationDate),
			periodStartDate: dates[0],
			periodEndDate: dates[1],
			contractorId: this.contract!.contractor.id,
			contractDetailId: this.contract!.contractDetail.id,
		};

		if (this.contract?.id) {
			this.facadeService
				.editContract(this.contract?.id, newContract)
				.pipe(untilDestroyed(this))
				.subscribe(contract => {
					this.modalRef.close(contract);
					this.facadeService.selectContract(null);
				});
		}
	}

	switchMode(status: boolean) {
		this.isEditMode = status;
	}

	close() {
		this.isEditMode = false;
		this.facadeService.selectContract(null);
		this.modalRef.close();
	}
}
