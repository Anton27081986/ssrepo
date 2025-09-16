import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	FieldCtrlDirective,
	FileFormats,
	FilesUploadComponent,
	FormFieldComponent,
	IconType,
	InputComponent,
	ModalComponent,
	NumberPickerComponent,
	PopoverTriggerForDirective,
	SelectComponent,
	Shape,
	TextareaComponent,
	TextComponent,
	TextType,
	TextWeight,
	ToggleComponent,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalRef } from '@front-library/components';
import { UntilDestroy } from '@ngneat/until-destroy';
import {IContractorCardSidePageData} from "@app/pages/contractors-dictionary/models/contractor-card-side-page-data";
import {IAddContractorsCardModalData} from "@app/pages/contractors-dictionary/models/add-contractors-card-modal-data";

@UntilDestroy()
@Component({
	selector: 'create-contractors-card-modal',
	templateUrl: './create-contractors-card-modal.component.html',
	styleUrls: ['./create-contractors-card-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		ButtonComponent,
		ModalComponent,
		TextComponent,
		InputComponent,
		ReactiveFormsModule,
		SelectComponent,
		DropdownListComponent,
		DropdownItemComponent,
		NumberPickerComponent,
		ToggleComponent,
		TextareaComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		PopoverTriggerForDirective,
		FilesUploadComponent,
	],
})
export class CreateContractorsCardModalComponent {
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly FileFormats = FileFormats;

	private readonly popup: ModalRef<IAddContractorsCardModalData> = inject(
		ModalRef<IAddContractorsCardModalData>
	);

	cardNumber = signal<number | null>(this.popup.data.id);

	// TODO: подставить реальные словари из сервиса/фасада
	dictionaries = {
		positions: [
			{ id: 1, name: 'Генеральный директор' },
			{ id: 2, name: 'Директор' },
		],
		clients: [
			{ id: 1, name: '+Данон' },
			{ id: 2, name: 'Киндер' },
		],
		regions: ['Республика Карелия'],
		categories: ['К3'],
		subSectors: ['масложировая'],
		creditStatuses: [
			{ id: 1, name: 'Положительный' },
			{ id: 2, name: 'Негативный' },
		],
		techLevels: [
			{ id: 1, name: 'Первый' },
			{ id: 2, name: 'Второй' },
		],
		countries: ['Россия'],
		groups: ['Покупатели'],
	};

	form = this.fb.group({
		// оф.инфо
		fullName: ['', Validators.required],
		shortName: ['', Validators.required],
		legalAddress: ['', Validators.required],
		foundingDate: [''],
		inn: [''],
		kpp: [''],
		ogrn: [''],
		ceoFio: ['', Validators.required],
		ceoPosition: ['', Validators.required],
		okved: [''],
		okvedExtra: [''],

		// общая
		client: [''],
		region: ['', Validators.required],
		category: [''],
		subSector: [''],
		creditStatus: [''],
		techLevel: [''],
		country: ['', Validators.required],
		group: ['', Validators.required],
		isStop: [false],

		// допинфо
		productionAddress: [''],
		shipToAddress: ['', Validators.required],
		corrAddress: [''],
		marketplaces: [''],
		notes: [''],
		bonusBn: [false],
		pmp: [false],
		attachCertificates: [false],
		cz: [false],
		edo: [false],
		edoId: [''],
		authorizedFio: [''],
		authorizedPosition: [''],
		chiefAccountant: [''],
		cashier: [''],
		employeesByKA: [0],
		employeesByClient: [0],
		site: [''],
		fax: [''],
		phone: [''],
		email: [''],
		designNuances: [''],

		// образец/особые
		sampleEnabled: [false],
		sampleFiles: [[] as File[]],
		specialTermsEnabled: [false],
		specialTermsText: [''],
		comment: [''],
	});

	constructor(
		private readonly modalRef: ModalRef,
		private fb: FormBuilder
	) {}

	onSaveDraft() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		const payload = this.form.getRawValue();
		this.modalRef.close();
	}

	onClose() {
		this.modalRef.close();
	}
}
