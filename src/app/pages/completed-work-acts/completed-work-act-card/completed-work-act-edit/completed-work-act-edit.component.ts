import {
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
	Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
import { IFile } from '@app/core/models/files/file';
import { forkJoin } from 'rxjs';
import { Permissions } from '@app/core/constants/permissions.constants';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { MultiselectV2Component } from '@app/shared/components/multiselect-v2/multiselect-v2.component';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';

@UntilDestroy()
@Component({
	selector: 'ss-completed-work-act-edit',
	templateUrl: './completed-work-act-edit.component.html',
	styleUrls: ['./completed-work-act-edit.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		ButtonComponent,
		ReactiveFormsModule,
		DateTimePickerComponent,
		SearchInputComponent,
		IconComponent,
		SelectV2Component,
		MultiselectV2Component,
		TextareaComponent,
		DatePipe,
		NgIf,
		NgForOf,
	],
})
export class CompletedWorkActEditComponent implements OnInit {
	@Input()
	specification: ICompletedWorkActSpecification | null = null;

	protected editActForm!: FormGroup<{
		dateUpload: FormControl<string | null>;
		finDocOrderIds: FormControl<IFilterOption[] | null>;
		applicantUserId: FormControl<number | null>;
		providerContractorId: FormControl<number | null>;
		contract: FormControl<IDictionaryItemDto | null>;
		currency: FormControl<IDictionaryItemDto | null>;
		comment: FormControl<string | null>;
	}>;

	protected act: Signal<ICompletedWorkAct | null> = toSignal(
		this.completedWorkActsFacade.act$,
		{
			initialValue: null,
		}
	);

	protected currencies: Signal<IDictionaryItemDto[]> = toSignal(
		this.completedWorkActsFacade.currencies$,
		{
			initialValue: [],
		}
	);

	protected contracts: Signal<IDictionaryItemDto[]> = toSignal(
		this.completedWorkActsFacade.contracts$,
		{
			initialValue: [],
		}
	);

	protected documents: Signal<IFile[]> = toSignal(
		this.completedWorkActsFacade.actAttachment$,
		{
			initialValue: [],
		}
	);

	public permissions: Signal<string[]> = toSignal(
		this.completedWorkActsFacade.permissions$,
		{
			initialValue: [],
		}
	);

	protected newDocuments: File[] = [];
	protected oldDocumentsList: IFile[] =
		this.completedWorkActsFacade.actAttachment.value;

	protected finDocOrders: IFilterOption[] = [];

	protected readonly Permissions = Permissions;
	constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef
	) {
		this.editActForm = new FormGroup({
			dateUpload: new FormControl<string | null>(null, [
				Validators.required,
			]),
			finDocOrderIds: new FormControl<IFilterOption[]>([]),
			applicantUserId: new FormControl<number | null>(null, [
				Validators.required,
			]),
			providerContractorId: new FormControl<number | null>(null, [
				Validators.required,
			]),
			contract: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			currency: new FormControl<IDictionaryItemDto | null>(null, [
				Validators.required,
			]),
			comment: new FormControl<string | null>(''),
		});

		this.completedWorkActsFacade.act$
			.pipe(untilDestroyed(this))
			.subscribe((act) => {
				if (act) {
					this.editActForm.controls.dateUpload.setValue(
						act.dateUpload
					);
					this.editActForm.controls.finDocOrderIds.setValue(
						act.finDocOrders.map((doc) => {
							return { ...doc, checked: true };
						})
					);
					this.editActForm.controls.applicantUserId.setValue(
						act.applicantUser?.id || null
					);
					this.editActForm.controls.providerContractorId.setValue(
						act.providerContractor?.id
					);
					this.editActForm.controls.contract.setValue(
						act.contract || null
					);
					this.editActForm.controls.currency.setValue(act.currency);
					this.editActForm.controls.comment.setValue(act.comment);

					if (act.providerContractor.id) {
						this.completedWorkActsFacade.getFinDocs(
							act.providerContractor.id,
							act.externalActDate
						);
					}
				}
			});
	}

	public ngOnInit(): void {
		this.completedWorkActsFacade.finDocs$
			.pipe(untilDestroyed(this))
			.subscribe((docs) => {
				if (docs) {
					const checked = this.act()?.finDocOrders || [];

					this.finDocOrders = docs.reduce(
						(
							previousValue: IFilterOption[],
							currentValue: IFilterOption
						) => {
							const selected = checked.find(
								(item) => item.id === currentValue.id
							);

							const nameArr = currentValue.name.split('|');
							const time = nameArr[2]
								.slice(0, -9)
								.trim()
								.split('/');

							nameArr[2] = ` ${[time[1], time[0], time[2]].join('.')} `;

							if (selected) {
								return [
									...previousValue,
									{
										...currentValue,
										name: nameArr.join('|'),
										checked: true,
									},
								];
							}

							return [
								...previousValue,
								{ ...currentValue, name: nameArr.join('|') },
							];
						},
						[]
					);

					this.ref.detectChanges();
				}
			});
	}

	protected switchMode(): void {
		this.completedWorkActsFacade.actAttachment.next(this.oldDocumentsList);
		this.completedWorkActsFacade.switchMode();
	}

	protected onSave(): void {
		this.editActForm.markAllAsTouched();

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

		if (this.editActForm.controls.applicantUserId.value) {
			this.editActForm.controls.applicantUserId.setErrors(null);
		} else {
			this.editActForm.controls.applicantUserId.setErrors({
				required: true,
			});

			return;
		}

		if (this.editActForm.invalid) {
			return;
		}

		if (this.editActForm.controls.dateUpload.value?.length === 10) {
			this.editActForm.controls.dateUpload.setValue(
				`${this.editActForm.controls.dateUpload.value}T00:00:00.000Z`
			);
		}

		const selectedFinDocIds = new Set(
			(this.editActForm.value.finDocOrderIds || []).map((finDoc) =>
				typeof finDoc === 'number' ? finDoc : finDoc.id
			)
		);

		const updatedFinDocOrders = this.finDocOrders.map((order) => ({
			...order,
			checked: selectedFinDocIds.has(order.id),
		}));

		this.editActForm.controls.finDocOrderIds.setValue(
			updatedFinDocOrders.filter((order) => order.checked)
		);

		const updatedAct: IUpdateAct = {
			...this.editActForm.value,
			finDocOrderIds: updatedFinDocOrders
				.filter((order) => order.checked)
				.map((order) => order.id),
			contractId: this.editActForm.value.contract?.id,
			currencyId: this.editActForm.value.currency?.id,
			documentIds: this.documents().map((file) => file.id) || [],
		};

		if (this.newDocuments.length) {
			forkJoin(
				this.newDocuments.map((file) =>
					this.completedWorkActsFacade.uploadFile(file)
				)
			)
				.pipe(untilDestroyed(this))
				.subscribe((files) => {
					updatedAct.documentIds = updatedAct.documentIds.concat(
						files.map((file) => file.id)
					);
					this.completedWorkActsFacade.updateAct(updatedAct);
				});
		} else {
			this.completedWorkActsFacade.updateAct(updatedAct);
		}
	}

	protected onApplicantUserSelect(id: number): void {
		if (id) {
			this.editActForm.controls.applicantUserId.setValue(id);
		}
	}

	protected onProviderContractorSelect(id: number): void {
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
						this.act()?.externalActDate || null
					);
					this.ref.detectChanges();
				});
		}
	}

	protected addFiles(event: Event): void {
		const element = event.currentTarget as HTMLInputElement;

		if (!element.files) {
			return;
		}

		Array.from(element.files).forEach((file): void => {
			const earlyLoaded = this.newDocuments.find(
				(doc) => doc.name === file.name
			);

			if (!earlyLoaded) {
				this.newDocuments.push(file);
			}
		});
	}

	protected removeFileFromUploadList(fileName: string): void {
		this.newDocuments = this.newDocuments.filter(
			(file) => file.name !== fileName
		);
	}

	protected deleteFile(fileId: string): void {
		this.completedWorkActsFacade.deleteFile(fileId);
	}

	protected onInputChange(event: any): void {
		if (!event.target.value) {
			const act = this.act();

			if (act) {
				act.applicantUser = undefined;
			}

			this.editActForm.controls.applicantUserId.setValue(null);
		}
	}
}
