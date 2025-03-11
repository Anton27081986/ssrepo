import {ChangeDetectorRef, Component, Input, OnInit, Signal} from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
import { IFile } from '@app/core/models/files/file';
import { forkJoin } from 'rxjs';
import { Permissions } from '@app/core/constants/permissions.constants';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {DateTimePickerComponent} from "@app/shared/components/inputs/date-time-picker/date-time-picker.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {SelectV2Component} from "@app/shared/components/inputs/select-v2/select-v2.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {MultiselectV2Component} from "@app/shared/components/multiselect-v2/multiselect-v2.component";

@UntilDestroy()
@Component({
	selector: 'ss-completed-work-act-edit',
	templateUrl: './completed-work-act-edit.component.html',
	styleUrls: ['./completed-work-act-edit.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		ButtonComponent,
		ReactiveFormsModule,
		InputComponent,
		DateTimePickerComponent,
		SearchInputComponent,
		SelectV2Component,
		NgIf,
		IconComponent,
		NgForOf,
		MultiselectV2Component
	],
	standalone: true
})
export class CompletedWorkActEditComponent implements OnInit {
	@Input() specification: ICompletedWorkActSpecification | null = null;

	protected editActForm!: FormGroup<{
		externalActNumber: FormControl<string | null>;
		internalActNumber: FormControl<string | null>;
		externalActDate: FormControl<string | null>;
		internalActDate: FormControl<string | null>;
		finDocOrderIds: FormControl<IFilterOption[] | null>;
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

	protected documents: Signal<IFile[]> = toSignal(this.completedWorkActsFacade.actAttachment$, {
		initialValue: [],
	});

	public permissions: Signal<string[]> = toSignal(this.completedWorkActsFacade.permissions$, {
		initialValue: [],
	});

	protected newDocuments: File[] = [];

	protected finDocOrders: IFilterOption[] = [];

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
			finDocOrderIds: new FormControl<IFilterOption[]>([]),
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
					act.finDocOrders.map(doc => {
						return { ...doc, checked: true };
					}),
				);
				this.editActForm.controls.applicantUserId.setValue(act.applicantUser?.id || null);
				this.editActForm.controls.buUnit.setValue(act.buUnit);
				this.editActForm.controls.payerContractorId.setValue(act.payerContractor?.id);
				this.editActForm.controls.providerContractorId.setValue(act.providerContractor?.id);
				this.editActForm.controls.contract.setValue(act.contract || null);
				this.editActForm.controls.currency.setValue(act.currency);

				this.finDocOrders = act.finDocOrders || [];

				if (act.providerContractor.id) {
					this.completedWorkActsFacade.getFinDocs(
						act.providerContractor.id,
						this.editActForm.controls.externalActDate.value,
					);
				}
			}
		});
	}

	public ngOnInit() {
		this.completedWorkActsFacade.finDocs$.pipe(untilDestroyed(this)).subscribe(docs => {
			this.finDocOrders = docs || [];
			this.ref.detectChanges();
		});
	}

	protected switchMode() {
		this.completedWorkActsFacade.switchMode(true);
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

		const selectedFinDocIds = new Set(
			(this.editActForm.value.finDocOrderIds || []).map(finDoc =>
				typeof finDoc === 'number' ? finDoc : finDoc.id,
			),
		);

		const updatedFinDocOrders = this.finDocOrders.map(order => ({
			...order,
			checked: selectedFinDocIds.has(order.id),
		}));

		this.editActForm.controls.finDocOrderIds.setValue(
			updatedFinDocOrders.filter(order => order.checked),
		);

		const updatedAct: IUpdateAct = {
			...this.editActForm.value,
			finDocOrderIds: updatedFinDocOrders
				.filter(order => order.checked)
				.map(order => order.id),
			buUnitId: this.editActForm.value.buUnit?.id,
			contractId: this.editActForm.value.contract?.id,
			currencyId: this.editActForm.value.currency?.id,
			documentIds: this.documents().map(file => file.id) || [],
		};

		if (this.newDocuments.length) {
			forkJoin(this.newDocuments.map(file => this.completedWorkActsFacade.uploadFile(file)))
				.pipe(untilDestroyed(this))
				.subscribe(files => {
					updatedAct.documentIds = updatedAct.documentIds.concat(
						files.map(file => file.id),
					);
					this.completedWorkActsFacade.updateAct(updatedAct);
				});
		} else {
			this.completedWorkActsFacade.updateAct(updatedAct);
		}
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
					this.editActForm.controls.finDocOrderIds.setValue([]);
					this.finDocOrders = [];
					this.completedWorkActsFacade.getFinDocs(
						id,
						this.editActForm.controls.externalActDate.value,
					);
					this.ref.detectChanges();
				});
		}
	}

	protected addFiles(event: Event) {
		const element = event.currentTarget as HTMLInputElement;

		if (!element.files) {
			return;
		}

		Array.from(element.files).forEach(file => {
			const earlyLoaded = this.newDocuments.find(doc => doc.name === file.name);

			if (!earlyLoaded) {
				this.newDocuments.push(file);
			}
		});
	}

	protected removeFileFromUploadList(fileName: string) {
		this.newDocuments = this.newDocuments.filter(file => file.name !== fileName);
	}

	protected deleteFile(fileId: string) {
		this.completedWorkActsFacade.deleteFile(fileId);
	}

	onInputChange(event: any) {
		if (!event.target.value) {
			const act = this.act();

			if (act) {
				act.applicantUser = undefined;
			}

			this.editActForm.controls.applicantUserId.setValue(null);
		}
	}

	protected readonly Permissions = Permissions;
}
