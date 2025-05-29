import { Injectable } from '@angular/core';
import { ModalRef, SharedPopupService } from '@front-library/components';
import { AddManufacturesPopupComponent } from '@app/pages/production-plan/modal/add-manufactures/add-manufactures-popup.component';
import {
	PostponePersonificationSidePageComponent,
	PostponeSidePageData,
} from '@app/pages/production-plan/modal/postpone-personification-side-page/postpone-personification-side-page.component';

@Injectable({ providedIn: 'root' })
export class OperationPlanPopupService {
	constructor(private readonly popup: SharedPopupService) {}

	public addSemiManufactures(): ModalRef {
		return this.popup.openModal(
			AddManufacturesPopupComponent,
			{},
			true,
			'920px',
		);
	}

	public openPostponePlanModal(id: number): ModalRef {
		return this.popup.openRightSidePage<PostponeSidePageData>(
			PostponePersonificationSidePageComponent,
			{ id },
			'860px',
		);
	}
}
