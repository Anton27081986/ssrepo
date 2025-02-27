import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompletedWorkActHistoryComponent } from '@app/pages/completed-work-acts/completed-work-act-history/completed-work-act-history.component';
import { ModalService } from '@app/core/modal/modal.service';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {Permissions} from "@app/core/constants/permissions.constants";

@Component({
	selector: 'ss-completed-work-act-card',
	templateUrl: './completed-work-act-card.component.html',
	styleUrls: ['./completed-work-act-card.component.scss'],
})
export class CompletedWorkActCardComponent {
	protected act: Signal<ICompletedWorkAct | null> = toSignal(this.completedWorkActsFacade.act$, {
		initialValue: null,
	});

	protected isEdit: Signal<boolean> = toSignal(this.completedWorkActsFacade.isEditMode$, {
		initialValue: false,
	});

	public permissions: Signal<string[]> = toSignal(this.completedWorkActsFacade.permissions$, {
		initialValue: [],
	});

	public constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly modalService: ModalService,
		private readonly router: Router,
	) {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.completedWorkActsFacade.getAct(id);
		}
	}

	public openHistoryModal(actId: number): void {
		this.modalService.open(CompletedWorkActHistoryComponent, { data: actId });
	}

	public toArchiveAct() {
		this.completedWorkActsFacade.toArchiveAct();
	}

	public pullAct() {
		this.completedWorkActsFacade.pullAct();
	}

	public restoreAct() {
		this.completedWorkActsFacade.restoreAct();
	}

	public toActsList() {
		this.router.navigate([`/completed-work-acts`]);
	}

	protected readonly Permissions = Permissions;
}
