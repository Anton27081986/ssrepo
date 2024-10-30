import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedWorkActHistoryComponent } from '@app/pages/completed-work-acts/completed-work-act-history/completed-work-act-history.component';
import { ModalService } from '@app/core/modal/modal.service';

@Component({
	selector: 'ss-completed-work-act-card',
	templateUrl: './completed-work-act-card.component.html',
	styleUrls: ['./completed-work-act-card.component.scss'],
})
export class CompletedWorkActCardComponent {
	protected actId: number | undefined;

	public constructor(
		private readonly activatedRoute: ActivatedRoute,
		@Inject(ModalService) private readonly modalService: ModalService,
	) {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.actId = Number.parseInt(id, 10);
		}
	}

	public openHistoryModal(actId: number): void {
		this.modalService.open(CompletedWorkActHistoryComponent, { data: actId });
	}
}
