import { Injectable } from '@angular/core';
import { ModalRef, SharedPopupService } from '@front-library/components';
import {
	AddManufacturesPopup,
	AddManufacturesPopupComponent,
} from '@app/pages/production-plan/modal/add-manufactures/add-manufactures-popup.component';
import {
	ModalUpdateRawMaterialsComponent,
	UpdateRawMaterialsData,
} from '@app/pages/production-plan/modal/modal-update-raw-materials/modal-update-raw-materials.component';
import {
	CreateCommentsModalComponent,
	CreateCommentsModalData,
} from '@app/pages/production-plan/modal/create-comments-modal/create-comments-modal.component';
import {
	ApproveMaterialComponent,
	ApproveMaterialData,
} from '@app/pages/production-plan/modal/approve-material/approve-material.component';
import {
	AddCommentsModalComponent,
	AddCommentsModalData,
} from '@app/pages/production-plan/modal/add-comments-modal/add-comments-modal.component';

@Injectable({ providedIn: 'root' })
export class OperationPlanPopupService {
	constructor(private readonly popup: SharedPopupService) {}

	public addSemiManufactures(weekId: number): ModalRef {
		return this.popup.openModal<AddManufacturesPopup>(
			AddManufacturesPopupComponent,
			{ weekId },
			true,
			'920px'
		);
	}

	public openCreateCommentsModal(id: number): ModalRef {
		return this.popup.openModal<CreateCommentsModalData>(
			CreateCommentsModalComponent,
			{ id },
			false,
			'449px'
		);
	}

	public openAddCommentsModal(id: number): ModalRef {
		return this.popup.openModal<AddCommentsModalData>(
			AddCommentsModalComponent,
			{ id },
			false,
			'449px'
		);
	}

	public openCalculationOfRawMaterials(
		data: UpdateRawMaterialsData
	): ModalRef {
		return this.popup.openModal<UpdateRawMaterialsData>(
			ModalUpdateRawMaterialsComponent,
			data,
			true,
			'584px'
		);
	}

	public openApproveMaterials(data: ApproveMaterialData): ModalRef {
		return this.popup.openModal<ApproveMaterialData>(
			ApproveMaterialComponent,
			data,
			true,
			'584px'
		);
	}
}
