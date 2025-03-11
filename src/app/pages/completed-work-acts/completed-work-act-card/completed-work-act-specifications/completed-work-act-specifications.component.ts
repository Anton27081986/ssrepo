import { Component, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { ModalService } from '@app/core/modal/modal.service';
import { SpecificationModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/add-specification-modal/specification-modal.component';
import {Permissions} from "@app/core/constants/permissions.constants";

@Component({
	selector: 'ss-completed-work-act-specifications',
	templateUrl: './completed-work-act-specifications.component.html',
	styleUrls: ['./completed-work-act-specifications.component.scss'],
})
export class CompletedWorkActSpecificationsComponent {
	protected readonly Permissions = Permissions;
	protected specifications: Signal<ICompletedWorkActSpecification[]> = toSignal(
		this.completedWorkActsFacade.specifications$,
		{
			initialValue: [],
		},
	);

	protected specificationsTotalAmount: Signal<number | null> = toSignal(
		this.completedWorkActsFacade.specificationsTotalAmount$,
		{
			initialValue: null,
		},
	);

	public permissions: Signal<string[]> = toSignal(this.completedWorkActsFacade.permissions$, {
		initialValue: [],
	});

	public constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly modalService: ModalService,
	) {}

	public onAddSpecification() {
		this.modalService.open(SpecificationModalComponent);
	}
}
