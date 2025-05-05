import { Injectable } from '@angular/core';
import { ModalRef, SharedPopupService } from '@front-library/components';
import { AddManufacturesPopupComponent } from '@app/pages/production-plan/modal/add-manufactures/add-manufactures-popup.component';

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
}
