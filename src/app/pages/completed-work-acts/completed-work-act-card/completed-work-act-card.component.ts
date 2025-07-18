import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompletedWorkActHistoryComponent } from '@app/pages/completed-work-acts/completed-work-act-history/completed-work-act-history.component';
import { ModalService } from '@app/core/modal/modal.service';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { Permissions } from '@app/core/constants/permissions.constants';
import {
	ButtonComponent as FrontButtonComponent,
	ButtonType,
	IconPosition,
	IconType,
	Size,
} from '@front-components/components';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { NgIf } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';

import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { CompletedWorkActEditComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-edit/completed-work-act-edit.component';
import { CompletedWorkActInfoComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-info/completed-work-act-info.component';
import { CompletedWorkActSpecificationsComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/completed-work-act-specifications.component';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';

@Component({
	selector: 'ss-completed-work-act-card',
	templateUrl: './completed-work-act-card.component.html',
	styleUrls: ['./completed-work-act-card.component.scss'],
	imports: [
		NgIf,
		IconComponent,
		TextComponent,
		TooltipDirective,
		DropdownButtonComponent,
		CompletedWorkActEditComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
		TagV2Component,
		FrontButtonComponent,
		ButtonComponent,
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
	protected readonly IconPosition = IconPosition;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly modalService: ModalService,
		private readonly router: Router
	) {
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

	public toActsList() {
		this.router.navigate([`/completed-work-acts`]);
	}

	public downloadInstruction() {
		const link = document.createElement('a');

		link.href = this.completedWorkActsFacade.linkToInstruction;
		link.click();
	}
}
