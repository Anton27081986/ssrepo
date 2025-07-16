import { Component, Inject, Signal } from "@angular/core";
import { ModalRef } from "@app/core/modal/modal.ref";
import { DialogComponent } from "@app/shared/components/dialog/dialog.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ModalService } from "@app/core/modal/modal.service";
import {
	AbstractControl,
	FormControl,
	FormGroup, ReactiveFormsModule,
	ValidationErrors,
	Validators
} from "@angular/forms";
import { CompletedWorkActsFacadeService } from "@app/core/facades/completed-work-acts-facade.service";
import { SearchFacadeService } from "@app/core/facades/search-facade.service";
import { IDictionaryItemDto } from "@app/core/models/company/dictionary-item-dto";
import { DIALOG_DATA } from "@app/core/modal/modal-tokens";
import { ICompletedWorkActSpecification } from "@app/core/models/completed-work-acts/specification";
import { toSignal } from "@angular/core/rxjs-interop";
import { ICompletedWorkAct } from "@app/core/models/completed-work-acts/completed-work-act";
import { ButtonComponent } from "@app/shared/components/buttons/button/button.component";
import { NumericInputComponent } from "@app/shared/components/_deprecated/numeric-input/numeric-input.component";
import { SearchInputComponent } from "@app/shared/components/inputs/search-input/search-input.component";
import { CardComponent } from "@app/shared/components/card/card.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { IconComponent } from "@app/shared/components/icon/icon.component";
import { TextareaComponent } from "@app/shared/components/textarea/textarea.component";
import { InputComponent } from "@app/shared/components/inputs/input/input.component";

@UntilDestroy()
@Component({
	selector: "ss-specification-modal",
	templateUrl: "./specification-modal.component.html",
	styleUrls: ["./specification-modal.component.scss"],
	imports: [
		ButtonComponent,
		NumericInputComponent,
		SearchInputComponent,
		CardComponent,
		TextComponent,
		IconComponent,
		ReactiveFormsModule,
		TextareaComponent,
		InputComponent
	],
	standalone: true
})
export class SpecificationModalComponent {
	private readonly defaultTovUnitsName = "шт";
	protected act: Signal<ICompletedWorkAct | null> = toSignal(this.completedWorkActsFacade.act$, {
		initialValue: null
	});

	protected addSpecificationForm!: FormGroup<{
		serviceId: FormControl<number | null>;
		comment: FormControl<string | null>;
		quantity: FormControl<number | null>;
		tovUnitId: FormControl<number | null>;
		costId: FormControl<number | null>;
		faObjectId: FormControl<number | null>;
		projectId: FormControl<number | null>;
		deptId: FormControl<number | null>;
		sectionId: FormControl<number | null>;
		userId: FormControl<number | null>;
		amount: FormControl<number | null>;
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
			serviceId: new FormControl<number | null>(null, [Validators.required]),
			comment: new FormControl<string | null>(null, [Validators.required]),
			quantity: new FormControl<number | null>(null),
			tovUnitId: new FormControl<number | null>(null),
			costId: new FormControl<number | null>(null, [Validators.required]),
			faObjectId: new FormControl<number | null>(null),
			projectId: new FormControl<number | null>(null),
			deptId: new FormControl<number | null>(null, [Validators.required]),
			sectionId: new FormControl<number | null>(null),
			userId: new FormControl<number | null>(null, [Validators.required]),
			amount: new FormControl<number | null>(null, [
				Validators.required,
				this.amountValidator
			])
		});

		if (spec) {
			this.addSpecificationForm.controls.serviceId.setValue(spec.service?.id || null);
			this.addSpecificationForm.controls.comment.setValue(spec.comment || null);
			this.addSpecificationForm.controls.quantity.setValue(spec.quantity || null);
			this.addSpecificationForm.controls.tovUnitId.setValue(spec.tovUnit?.id || null);
			this.addSpecificationForm.controls.costId.setValue(spec.cost?.id || null);
			this.addSpecificationForm.controls.faObjectId.setValue(spec.faObject?.id || null);
			this.addSpecificationForm.controls.projectId.setValue(spec.project?.id || null);
			this.addSpecificationForm.controls.deptId.setValue(spec.dept?.id || null);
			this.addSpecificationForm.controls.sectionId.setValue(spec.section?.id || null);
			this.addSpecificationForm.controls.userId.setValue(spec.user?.id || null);
			this.addSpecificationForm.controls.amount.setValue(spec.amount || null);

			this.myDept = spec.dept;
			this.mySection = spec.section;
		} else if (this.act()) {
			const user = this.act()?.applicantUser;

			if (user) {
				this.onUserSelect(user);
			}

			this.searchFacade
				.getDictionaryTovUnits(this.defaultTovUnitsName)
				.pipe(untilDestroyed(this))
				.subscribe(units => {
					this.defaultTovUnits = units.items.find(
						item => item.name === this.defaultTovUnitsName
					);

					if (this.defaultTovUnits) {
						this.addSpecificationForm.controls.tovUnitId.setValue(
							this.defaultTovUnits.id
						);
					}
				});
		}
	}

	protected resetValueControlMySection(event: any, control: AbstractControl): void {
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
				.getDictionaryDepts("", this.user.id)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					if (res.items.length) {
						this.myDept = res.items[0];
						this.addSpecificationForm.controls.deptId.setValue(this.myDept.id);
						this.getMySection();
					}
				});
		}
	}

	protected getMySection() {
		if (this.myDept?.id) {
			this.searchFacade
				.getDictionarySections("", this.myDept?.id)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					if (res.items.length) {
						this.mySection = res.items[0];
						this.addSpecificationForm.controls.sectionId.setValue(this.mySection.id);
					} else {
						this.mySection = undefined;
						this.addSpecificationForm.controls.sectionId.setValue(null);
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

	protected close() {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: "Данные не будут сохранены",
					text: "Вы уверены, что хотите уйти?"
				}
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	private setErrorsIfNotControlValue(control: AbstractControl): void {
		if (!control.value) {
			control.setErrors({ required: true });
		}
	}

	protected setErrorsControl(): void {
		this.setErrorsIfNotControlValue(this.addSpecificationForm.controls.serviceId);
		this.setErrorsIfNotControlValue(this.addSpecificationForm.controls.costId);
		this.setErrorsIfNotControlValue(this.addSpecificationForm.controls.deptId);
		this.setErrorsIfNotControlValue(this.addSpecificationForm.controls.userId);
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
			.updateSpecification({ ...this.addSpecificationForm.value, id: this.spec.id })
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
			});
	}
}
