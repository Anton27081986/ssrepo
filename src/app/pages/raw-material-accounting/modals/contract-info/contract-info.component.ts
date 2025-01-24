import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { RawMaterialAccountingFacadeService } from '@app/core/facades/raw-material-accounting-facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRawMaterialAccountingContract } from '@app/core/models/raw-material-accounting/contract';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Permissions } from '@app/core/constants/permissions.constants';
import {
	fromPickerDateToIso,
	fromPickerRangeDateToIso,
} from '@app/shared/pipe/from-picker-date-to-iso';
import { AddContractDto } from '@app/core/models/raw-material-accounting/add-contract-dto';
import { Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {CardComponent} from "@app/shared/components/card/card.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {DateRangeComponent} from "@app/shared/components/inputs/date-range/date-range.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";

interface IDialogData {
	id?: string | null;
}

@UntilDestroy()
@Component({
	selector: 'ss-contract-info',
	templateUrl: './contract-info.component.html',
	styleUrls: ['./contract-info.component.scss'],
	imports: [
		CardComponent,
		NgIf,
		HeadlineComponent,
		IconComponent,
		TextComponent,
		ReactiveFormsModule,
		InputComponent,
		DateRangeComponent,
		SearchInputComponent,
		TextareaComponent,
		ButtonComponent,
		LoaderComponent,
		AsyncPipe
	],
	standalone: true
})
export class ContractInfoComponent {
	public isLoading$: Observable<boolean>;
	public contract: IRawMaterialAccountingContract | null = null;
	public canEdit: boolean = false;
	public isEditMode: boolean = false;

	public editForm!: FormGroup;
	constructor(
		private readonly modalRef: ModalRef,
		private readonly facadeService: RawMaterialAccountingFacadeService,
		@Inject(DIALOG_DATA) private readonly data: IDialogData,
	) {
		this.isLoading$ = this.facadeService.isContractLoading$;

		this.editForm = new FormGroup({
			quantityTotal: new FormControl<number>(0, [
				Validators.required,
				Validators.min(1),
				Validators.max(99999999999),
			]),
			price: new FormControl<number>(0, [
				Validators.required,
				Validators.min(1),
				Validators.max(99999999999),
			]),
			period: new FormControl<string>('', Validators.required),
			isComplete: new FormControl<boolean>(false),
			reasonCompletion: new FormControl<string>(''),
			tradePosition: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
		});

		this.facadeService.selectedContract$.pipe(untilDestroyed(this)).subscribe(contract => {
			if (contract) {
				this.contract = contract.data;
				this.canEdit = contract.permissions.includes(Permissions.CLIENT_PROCUREMENTS_EDIT);

				if (typeof contract.data.notificationDate === 'string') {
					this.contract.notificationDate = new Date(
						Date.parse(contract.data.notificationDate),
					).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					});
				}

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
				this.editForm.controls.tradePosition.setValue(contract.data.tov);
			}
		});

		if (data.id) {
			this.facadeService.selectContract(data.id);
		}
	}

	public saveContract() {
		this.editForm.markAllAsTouched();

		if (
			this.editForm.controls.isComplete.value &&
			!this.editForm.controls.reasonCompletion.value
		) {
			this.editForm.controls.reasonCompletion.setErrors({ required: true });
		}

		if (
			this.contract?.quantityReceived &&
			parseFloat(this.editForm.controls.quantityTotal.value) < this.contract?.quantityReceived
		) {
			this.editForm.controls.quantityTotal.setErrors({ error: true });
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
			notificationDate: this.contract!.notificationDate
				? fromPickerDateToIso(this.contract!.notificationDate)
				: null,
			periodStartDate: dates[0],
			periodEndDate: dates[1],
			contractorId: this.contract!.contractor.id,
			contractDetailId: this.contract!.contractDetail.id,
			tovId: this.editForm.value.tradePosition.id,
		};

		if (this.contract?.id) {
			this.facadeService
				.editContract(this.contract?.id, newContract)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.modalRef.close(true);
				});
		}
	}

	selectSearchItem(item: IDictionaryItemDto | null, ctrl: AbstractControl) {
		ctrl.setValue(item);
		ctrl.markAsTouched();
	}

	switchMode(status: boolean) {
		this.isEditMode = status;
	}

	close() {
		this.isEditMode = false;
		this.modalRef.close(false);
	}
}
