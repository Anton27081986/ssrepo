import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompletedWorkActHistoryComponent } from '@app/pages/completed-work-acts/completed-work-act-history/completed-work-act-history.component';
import { ModalService } from '@app/core/modal/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { Permissions } from '@app/core/constants/permissions.constants';
import { ReturnToApplicantModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/return-to-applicant-modal/return-to-applicant-modal.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CorrespondenceTypeEnum } from '@app/widgets/correspondence/correspondence-type-enum';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { CommonModule, NgIf } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { CorrespondenceComponent } from '@app/widgets/correspondence/correspondence.component';
import {
	CompletedWorkActEditComponent
} from "@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-edit/completed-work-act-edit.component";
import {
	CompletedWorkActInfoComponent
} from "@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-info/completed-work-act-info.component";
import {
	CompletedWorkActSpecificationsComponent
} from "@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/completed-work-act-specifications.component";

@UntilDestroy()
@Component({
	selector: 'ss-completed-work-act-card',
	templateUrl: './completed-work-act-card.component.html',
	styleUrls: ['./completed-work-act-card.component.scss'],
	imports: [
		CommonModule,
		NgIf,
		IconComponent,
		TextComponent,
		TagV2Component,
		ButtonComponent,
		DropdownButtonComponent,
		CorrespondenceComponent,
		CompletedWorkActEditComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
	],
	standalone: true,
})
export class CompletedWorkActCardComponent {
	protected act: Signal<ICompletedWorkAct | null> = toSignal(
		this.completedWorkActsFacade.act$,
		{
			initialValue: null,
		}
	);

	protected isEdit: Signal<boolean> = toSignal(
		this.completedWorkActsFacade.isEditMode$,
		{
			initialValue: false,
		}
	);

	public permissions: Signal<string[]> = toSignal(
		this.completedWorkActsFacade.permissions$,
		{
			initialValue: [],
		}
	);

	protected readonly Permissions = Permissions;
	protected readonly CorrespondenceTypeEnum = CorrespondenceTypeEnum;
	constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly modalService: ModalService,
		private readonly router: Router
	) {
		if (this.isEdit()) {
			this.completedWorkActsFacade.switchMode();
		}

		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.completedWorkActsFacade.getAct(id);
		}
	}

	public openHistoryModal(actId: number): void {
		this.modalService.open(CompletedWorkActHistoryComponent, {
			data: actId,
		});
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

	public sendActToAdmin() {
		this.completedWorkActsFacade.sendActToAdmin();
	}

	public sendActToApplicant() {
		this.modalService
			.open(ReturnToApplicantModalComponent, {
				data: { title: 'Отправить заявителю', okButton: 'Отправить' },
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((comment: string) => {
				if (comment) {
					this.completedWorkActsFacade.sendActToApplicant(comment);
				}
			});
	}

	public returnActToApplicant() {
		this.modalService
			.open(ReturnToApplicantModalComponent, {
				data: { title: 'Вернуть заявителю', okButton: 'Вернуть' },
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((comment: string) => {
				if (comment) {
					this.completedWorkActsFacade.returnActToApplicant(comment);
				}
			});
	}

	public toActsList() {
		this.router.navigate([`/completed-work-acts`]);
	}

	public hasActions() {
		return (
			this.permissions().includes(
				Permissions.COMPLETED_WORK_ACTS_RESTORE
			) ||
			this.permissions().includes(
				Permissions.COMPLETED_WORK_ACTS_PULL_ACT
			) ||
			this.permissions().includes(
				Permissions.COMPLETED_WORK_ACTS_RETURN_BACK_TO_APPLICANT
			) ||
			this.permissions().includes(
				Permissions.COMPLETED_WORK_ACTS_SEND_TO_APPLICANT
			) ||
			this.permissions().includes(
				Permissions.COMPLETED_WORK_ACTS_SEND_TO_ADMINISTRATOR
			) ||
			this.permissions().includes(Permissions.COMPLETED_WORK_ACTS_DELETE)
		);
	}
}
