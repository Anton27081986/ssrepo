import { Component, Input, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';

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
		inn: FormControl<string | null>;
		finDocOrderIds: FormControl<number[] | null>;
		oneSNumber: FormControl<string | null>;
		oneSComment: FormControl<string | null>;
		applicantUserId: FormControl<number | null>;
		buUnitId: FormControl<number | null>;
		payerContractorId: FormControl<number | null>;
		payerBuUnitId: FormControl<number | null>;
		providerContractorId: FormControl<number | null>;
		contractId: FormControl<number | null>;
		currency: FormControl<string | null>;
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

	public constructor(private readonly completedWorkActsFacade: CompletedWorkActsFacadeService) {
		this.editActForm = new FormGroup({
			externalActNumber: new FormControl<string | null>(null, [Validators.required]),
			internalActNumber: new FormControl<string | null>(null, [Validators.required]),
			externalActDate: new FormControl<string | null>(null, [Validators.required]),
			internalActDate: new FormControl<string | null>(null, [Validators.required]),
			inn: new FormControl<string | null>(null, [Validators.required]),
			finDocOrderIds: new FormControl<number[] | null>(null),
			oneSNumber: new FormControl<string | null>(null, [Validators.required]),
			oneSComment: new FormControl<string | null>(null, [Validators.required]),
			applicantUserId: new FormControl<number | null>(null, [Validators.required]),
			buUnitId: new FormControl<number | null>(null, [Validators.required]),
			payerContractorId: new FormControl<number | null>(null, [Validators.required]),
			payerBuUnitId: new FormControl<number | null>(null, [Validators.required]),
			providerContractorId: new FormControl<number | null>(null, [Validators.required]),
			contractId: new FormControl<number | null>(null, [Validators.required]),
			currency: new FormControl<string | null>(null, [Validators.required]),
		});

		this.completedWorkActsFacade.act$.pipe(untilDestroyed(this)).subscribe(act => {
			if (act) {
				this.editActForm.controls.externalActNumber.setValue(act.externalActNumber);
				this.editActForm.controls.internalActNumber.setValue(act.internalActNumber);
				this.editActForm.controls.externalActDate.setValue(act.externalActDate);
				this.editActForm.controls.internalActDate.setValue(act.internalActDate);
				this.editActForm.controls.inn.setValue(act.inn);
				this.editActForm.controls.finDocOrderIds.setValue(act.finDocOrderIds);
				this.editActForm.controls.oneSNumber.setValue(act.oneSNumber);
				this.editActForm.controls.oneSComment.setValue(act.oneSComment);
				this.editActForm.controls.applicantUserId.setValue(act.applicantUser?.id);
				this.editActForm.controls.buUnitId.setValue(act.buUnit?.id);
				this.editActForm.controls.payerContractorId.setValue(act.payerContractor?.id);
				this.editActForm.controls.payerBuUnitId.setValue(act.payerBuUnit?.id);
				this.editActForm.controls.providerContractorId.setValue(act.providerContractor?.id);
				this.editActForm.controls.contractId.setValue(act.contract?.id);
				this.editActForm.controls.currency.setValue(act.currency);
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

		this.completedWorkActsFacade
			.updateAct(this.editActForm.value)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.switchMode();
			});
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
