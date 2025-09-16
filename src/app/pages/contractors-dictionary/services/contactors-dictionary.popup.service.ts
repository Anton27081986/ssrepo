import { Injectable } from '@angular/core';
import { ModalRef, SharedPopupService } from '@front-library/components';
import {
	CreateContractorsCardModalComponent
} from "@app/pages/contractors-dictionary/modal/create-contractors-card-modal/create-contractors-card-modal.component";

@Injectable({ providedIn: 'root' })
export class ContractorsDictionaryPopupService {
	constructor(private readonly popup: SharedPopupService) {}

	public openCreateContractorsCardModal(data: string): ModalRef {
		return this.popup.openModal<string>(
			CreateContractorsCardModalComponent,
			data,
			true,
			'1080px'
		);
	}
}
