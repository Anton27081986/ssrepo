import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { NgForOf, NgIf } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-card-popup-order-approval',
	templateUrl: './mp-reservation-orders-card-popup-order-approval.component.html',
	styleUrls: ['./mp-reservation-orders-card-popup-order-approval.component.scss'],
	standalone: true,
	imports: [
		CardComponent,
		IconComponent,
		ReactiveFormsModule,
		ButtonComponent,
		TextComponent,
		InputComponent,
		NgForOf,
		NgIf,
		IconComponent,
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		InputComponent,
	],
})
export class MpReservationOrdersCardPopupOrderApprovalComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public approvalForm!: FormGroup<{
		tov: FormControl<IDictionaryItemDto | null>;
		quantity: FormControl<number | null>;
		warehouses: FormArray<
			FormGroup<{
				warehouseName: FormControl<string>;
				inProduction: FormControl<number | null>;
				inStock: FormControl<number | null>;
				fact: FormControl<number | null>;
			}>
		>;
	}>;

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
	) {
		this.approvalForm = new FormGroup({
			tov: new FormControl<IDictionaryItemDto | null>(null, [Validators.required]),
			quantity: new FormControl<number | null>(null, [Validators.required]),
			warehouses: new FormArray<
				FormGroup<{
					warehouseName: FormControl<string>;
					inProduction: FormControl<number | null>;
					inStock: FormControl<number | null>;
					fact: FormControl<number | null>;
				}>
			>([]),
		});

		this.addWarehouse('ССП Сосневский', 300, 200, 4);
		this.addWarehouse('ССП Готовая продукция', 1000, 100, 8);
	}

	public get warehouses(): FormArray {
		return this.approvalForm.get('warehouses') as FormArray;
	}

	private createWarehouseRow(
		warehouseName: string,
		inProduction: number,
		inStock: number,
		fact: number,
	): FormGroup {
		return new FormGroup({
			warehouseName: new FormControl<string>(warehouseName),
			inProduction: new FormControl<number | null>(inProduction),
			inStock: new FormControl<number | null>(inStock),
			fact: new FormControl<number | null>(fact),
		});
	}

	public addWarehouse(
		warehouseName: string,
		inProduction: number,
		inStock: number,
		fact: number,
	) {
		this.warehouses.push(this.createWarehouseRow(warehouseName, inProduction, inStock, fact));
	}

	public close(): void {
		this.modalRef.close();
	}
}
