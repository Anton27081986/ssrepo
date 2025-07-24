import { Component, Inject, Signal } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { NumericInputComponent } from '@app/shared/components/_deprecated/numeric-input/numeric-input.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
	selector: 'ss-specification-modal',
	templateUrl: './specification-modal.component.html',
	styleUrls: ['./specification-modal.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		IconComponent,
		ReactiveFormsModule,
		SearchInputComponent,
		NumericInputComponent,
		ButtonComponent,
	],
})
export class SpecificationModalComponent {
	private readonly defaultTovUnitsName = 'шт';
	protected act: Signal<ICompletedWorkAct | null> = toSignal(
		this.completedWorkActsFacade.act$,
		{
			initialValue: null,
		}
	);

	protected addSpecificationForm!: FormGroup<{
		costId: FormControl<number | null>;
		faObjectId: FormControl<number | null>;
		projectId: FormControl<number | null>;
		deptId: FormControl<number | null>;
		sectionId: FormControl<number | null>;
		userId: FormControl<number | null>;
		sum: FormControl<number | null>;
	}>;

	protected user: IDictionaryItemDto | undefined;
	protected myDept: IDictionaryItemDto | undefined;
	protected mySection: IDictionaryItemDto | undefined;
	protected defaultTovUnits: IDictionaryItemDto | undefined;

	constructor(
		@Inject(DIALOG_DATA) protected spec: ICompletedWorkActSpecification,
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly searchFacade: SearchFacadeService
	) {
		this.addSpecificationForm = new FormGroup({
			costId: new FormControl<number | null>(null, [Validators.required]),
			faObjectId: new FormControl<number | null>(null),
			projectId: new FormControl<number | null>(null),
			deptId: new FormControl<number | null>(null, [Validators.required]),
			sectionId: new FormControl<number | null>(null),
			userId: new FormControl<number | null>(null, [Validators.required]),
			sum: new FormControl<number | null>(null, [
				Validators.required,
				this.amountValidator,
			]),
		});

		if (spec) {
			this.addSpecificationForm.controls.costId.setValue(
				spec.cost?.id || null
			);
			this.addSpecificationForm.controls.faObjectId.setValue(
				spec.faObject?.id || null
			);
			this.addSpecificationForm.controls.projectId.setValue(
				spec.project?.id || null
			);
			this.addSpecificationForm.controls.deptId.setValue(
				spec.dept?.id || null
			);
			this.addSpecificationForm.controls.sectionId.setValue(
				spec.section?.id || null
			);
			this.addSpecificationForm.controls.userId.setValue(
				spec.user?.id || null
			);
			this.addSpecificationForm.controls.sum.setValue(spec.sum || null);

			this.myDept = spec.dept;
			this.mySection = spec.section;
		} else if (this.act()) {
			const user = this.act()?.applicantUser;

			if (user) {
				this.onUserSelect(user);
			}
		}
	}

	protected resetValueControlMySection(
		event: any,
		control: AbstractControl
	): void {
		control.markAsTouched();

		if (!(event.target as HTMLInputElement).value) {
			control.setValue(null);
			this.mySection = undefined;
		}
	}

	protected amountValidator(control: FormControl): ValidationErrors | null {
		const value = control.value;

		if (value && !/^\d*\.?\d*$/.test(value)) {
			return { invalidAmount: true };
		}

		return null;
	}

	protected getMyDept() {
		if (this.user) {
			this.searchFacade
				.getDictionaryDepts('', this.user.id)
				.pipe(untilDestroyed(this))
				.subscribe((res) => {
					if (res.items.length) {
						this.myDept = res.items[0];
						this.addSpecificationForm.controls.deptId.setValue(
							this.myDept.id
						);
						this.getMySection();
					}
				});
		}
	}

	protected getMySection() {
		if (this.myDept?.id) {
			this.searchFacade
				.getDictionarySections('', this.myDept?.id)
				.pipe(untilDestroyed(this))
				.subscribe((res) => {
					if (res.items.length) {
						this.mySection = res.items[0];
						this.addSpecificationForm.controls.sectionId.setValue(
							this.mySection.id
						);
					} else {
						this.mySection = undefined;
						this.addSpecificationForm.controls.sectionId.setValue(
							null
						);
					}
				});
		}
	}

	protected onUserSelect(user: IDictionaryItemDto) {
		if (user.id) {
			this.user = user;
			this.addSpecificationForm.controls.userId.setValue(user.id);
			this.addSpecificationForm.controls.userId.setErrors(null);
			this.getMyDept();
		}
	}

	protected onDeptSelect(dept: IDictionaryItemDto) {
		if (dept.id) {
			this.addSpecificationForm.controls.deptId.setValue(dept.id);
		} else if (this.myDept) {
			this.addSpecificationForm.controls.deptId.setValue(this.myDept.id);
		}
	}

	protected close() {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Данные не будут сохранены',
					text: 'Вы уверены, что хотите уйти?',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((status) => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setValue('');
			control.setErrors({ required: true });
		}
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(
			this.addSpecificationForm.controls.costId
		);
		this.setErrorsIfNotControlValue(
			this.addSpecificationForm.controls.deptId
		);
		this.setErrorsIfNotControlValue(
			this.addSpecificationForm.controls.userId
		);
	}

	protected addSpecification() {
		this.setErrorsControl();

		this.addSpecificationForm.markAllAsTouched();

		if (this.addSpecificationForm.invalid) {
			return;
		}

		this.completedWorkActsFacade
			.addSpecificationToAct(this.addSpecificationForm.value)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
			});
	}

	protected updateSpecification() {
		this.setErrorsControl();

		this.addSpecificationForm.markAllAsTouched();

		if (this.addSpecificationForm.invalid) {
			return;
		}

		this.completedWorkActsFacade
			.updateSpecification({
				...this.addSpecificationForm.value,
				id: this.spec.id,
			})
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
			});
	}
}
