import { ChangeDetectorRef, Component, Input, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';

@UntilDestroy()
@Component({
	selector: 'ss-completed-work-act-edit',
	templateUrl: './completed-work-act-edit.component.html',
	styleUrls: ['./completed-work-act-edit.component.scss'],
})
export class CompletedWorkActEditComponent {
	@Input() specification: ICompletedWorkActSpecification | null = null;

	protected editActForm!: FormGroup<{
		externalActNumber: FormControl<string | null>;
		internalActNumber: FormControl<string | null>;
		externalActDate: FormControl<string | null>;
		internalActDate: FormControl<string | null>;
		finDocOrderIds: FormControl<number[] | null>;
		applicantUserId: FormControl<number | null>;
		buUnit: FormControl<IDictionaryItemDto | null>;
		payerContractorId: FormControl<number | null>;
		providerContractorId: FormControl<number | null>;
		contract: FormControl<IDictionaryItemDto | null>;
		currency: FormControl<IDictionaryItemDto | null>;
	}>;

	protected act: Signal<ICompletedWorkAct | null> = toSignal(this.completedWorkActsFacade.act$, {
		initialValue: null,
	});

	protected currencies: Signal<IDictionaryItemDto[]> = toSignal(
		this.completedWorkActsFacade.currencies$,
		{
			initialValue: [],
		},
	);

	protected buUnits: Signal<IDictionaryItemDto[]> = toSignal(
		this.completedWorkActsFacade.buUnits$,
		{
			initialValue: [],
		},
	);

	protected contracts: Signal<IDictionaryItemDto[]> = toSignal(
		this.completedWorkActsFacade.contracts$,
		{
			initialValue: [],
		},
	);

	protected finDocOrders: IDictionaryItemDto[] = [];

	public constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef,
	) {
		this.editActForm = new FormGroup({
			externalActNumber: new FormControl<string | null>('', [Validators.required]),
			internalActNumber: new FormControl<string | null>('', [Validators.required]),
			externalActDate: new FormControl<string | null>(null, [Validators.required]),
			internalActDate: new FormControl<string | null>(null, [Validators.required]),
			finDocOrderIds: new FormControl<number[] | null>(null),
			applicantUserId: new FormControl<number | null>(null, [Validators.required]),
			buUnit: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			payerContractorId: new FormControl<number | null>(null, [Validators.required]),
			providerContractorId: new FormControl<number | null>(null, [Validators.required]),
			contract: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			currency: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
		});

		this.completedWorkActsFacade.act$.pipe(untilDestroyed(this)).subscribe(act => {
			if (act) {
				this.editActForm.controls.externalActNumber.setValue(act.externalActNumber);
				this.editActForm.controls.internalActNumber.setValue(act.internalActNumber);
				this.editActForm.controls.externalActDate.setValue(act.externalActDate);
				this.editActForm.controls.internalActDate.setValue(act.internalActDate);
				this.editActForm.controls.finDocOrderIds.setValue(
					act.finDocOrders.map(doc => doc.id),
				);
				this.editActForm.controls.applicantUserId.setValue(act.applicantUser?.id || null);
				this.editActForm.controls.buUnit.setValue(act.buUnit);
				this.editActForm.controls.payerContractorId.setValue(act.payerContractor?.id);
				this.editActForm.controls.providerContractorId.setValue(act.providerContractor?.id);
				this.editActForm.controls.contract.setValue(act.contract || null);
				this.editActForm.controls.currency.setValue(act.currency);

				this.finDocOrders = this.act()?.finDocOrders || [];

				this.finDocOrders = act.finDocOrders || [];
			}
		});
	}

	protected switchMode() {
		this.completedWorkActsFacade.switchMode();
	}

	protected setFinDocOrdersIds(docs: IDictionaryItemDto[]) {
		this.editActForm.controls.finDocOrderIds.setValue(docs.map(item => item.id));
	}

	protected onSave() {
		this.editActForm.markAllAsTouched();

		if (this.editActForm.controls.buUnit.value) {
			this.editActForm.controls.buUnit.setErrors(null);
		} else {
			return;
		}

		if (this.editActForm.controls.contract.value) {
			this.editActForm.controls.contract.setErrors(null);
		} else {
			return;
		}

		if (this.editActForm.controls.currency.value) {
			this.editActForm.controls.currency.setErrors(null);
		} else {
			return;
		}

		if (this.editActForm.invalid) {
			return;
		}

		if (this.editActForm.controls.externalActDate.value?.length === 10) {
			this.editActForm.controls.externalActDate.setValue(
				`${this.editActForm.controls.externalActDate.value}T00:00:00.000Z`,
			);
		}

		if (this.editActForm.controls.internalActDate.value?.length === 10) {
			this.editActForm.controls.internalActDate.setValue(
				`${this.editActForm.controls.internalActDate.value}T00:00:00.000Z`,
			);
		}

		const { buUnit, ...actForm } = this.editActForm.value;

		const updatedAct: IUpdateAct = {
			...actForm,
			buUnitId: buUnit?.id,
			contractId: actForm.contract?.id,
			currencyId: actForm.currency?.id,
		};

		this.completedWorkActsFacade
			.updateAct(updatedAct)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.switchMode();
			});
	}

	protected onApplicantUserSelect(id: number) {
		if (id) {
			this.editActForm.controls.applicantUserId.setValue(id);
			this.searchFacade
				.getDictionaryBuUnits(undefined, id)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					const unit = res.items[0];

					if (unit) {
						this.editActForm.controls.buUnit.setValue(unit);
						this.ref.detectChanges();
					}
				});
		}
	}

	protected onProviderContractorSelect(id: number) {
		if (id) {
			this.editActForm.controls.providerContractorId.setValue(id);
			this.completedWorkActsFacade
				.getContracts(id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.editActForm.controls.contract.setValue(null);
					this.ref.detectChanges();
				});
		}
	}

	protected uploadFile(event: Event) {
		const element = event.currentTarget as HTMLInputElement;
		const fileList: FileList | null = element.files;

		if (!fileList) {
			return;
		}

		Array.from(fileList).forEach(file => {
			const reader = new FileReader();

			reader.onload = () => {
				this.completedWorkActsFacade.uploadFile(file);
			};

			reader.readAsDataURL(file);
		});
	}

	protected deleteFile(fileId: string) {
		this.completedWorkActsFacade.removeFileFromAct(fileId);
	}
}
