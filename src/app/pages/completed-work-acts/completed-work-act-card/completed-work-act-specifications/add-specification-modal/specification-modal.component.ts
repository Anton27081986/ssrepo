import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';

@UntilDestroy()
@Component({
	selector: 'ss-specification-modal',
	templateUrl: './specification-modal.component.html',
	styleUrls: ['./specification-modal.component.scss'],
})
export class SpecificationModalComponent {
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

	constructor(
		@Inject(DIALOG_DATA) protected readonly spec: ICompletedWorkActSpecification,
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly userFacade: UserFacadeService,
		private readonly searchFacade: SearchFacadeService,
	) {
		this.addSpecificationForm = new FormGroup({
			serviceId: new FormControl<number | null>(null, [Validators.required]),
			comment: new FormControl<string | null>(null, [Validators.required]),
			quantity: new FormControl<number | null>(null, [Validators.required]),
			tovUnitId: new FormControl<number | null>(null, [Validators.required]),
			costId: new FormControl<number | null>(null, [Validators.required]),
			faObjectId: new FormControl<number | null>(null, [Validators.required]),
			projectId: new FormControl<number | null>(null, [Validators.required]),
			deptId: new FormControl<number | null>(null, [Validators.required]),
			sectionId: new FormControl<number | null>(null, [Validators.required]),
			userId: new FormControl<number | null>(null, [Validators.required]),
			amount: new FormControl<number | null>(null, [Validators.required]),
		});

		if (spec) {
			this.addSpecificationForm.controls.serviceId.setValue(spec.service.id);
			this.addSpecificationForm.controls.comment.setValue(spec.comment);
			this.addSpecificationForm.controls.quantity.setValue(spec.quantity);
			this.addSpecificationForm.controls.tovUnitId.setValue(spec.tovUnit.id);
			this.addSpecificationForm.controls.costId.setValue(spec.cost.id);
			this.addSpecificationForm.controls.faObjectId.setValue(spec.faObject.id);
			this.addSpecificationForm.controls.projectId.setValue(spec.project.id);
			this.addSpecificationForm.controls.deptId.setValue(spec.dept.id);
			this.addSpecificationForm.controls.sectionId.setValue(spec.section.id);
			this.addSpecificationForm.controls.userId.setValue(spec.user.id);
			this.addSpecificationForm.controls.amount.setValue(spec.amount);
		} else {
			this.userFacade
				.getUserProfile()
				.pipe(untilDestroyed(this))
				.subscribe(user => {
					if (user) {
						this.user = { id: user.id, name: user.name };
						this.addSpecificationForm.controls.userId.setValue(user.id);
						this.getMyDept();
					}
				});
		}
	}

	protected getMyDept() {
		if (this.user) {
			this.searchFacade
				.getDictionaryDepts('', this.user.id)
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
				.getDictionarySections('', this.myDept?.id)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					if (res.items.length) {
						this.mySection = res.items[0];
						this.addSpecificationForm.controls.sectionId.setValue(this.mySection.id);
					}
				});
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
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	protected addSpecification() {
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
