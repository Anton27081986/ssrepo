import { Injectable } from '@angular/core';
import { ModalRef, SharedPopupService } from '@front-library/components';
import { CreateContractorsCardModalComponent } from '@app/pages/contractors-dictionary/modal/create-contractors-card-modal/create-contractors-card-modal.component';
import { IAddContractorsCardModalData } from '@app/pages/contractors-dictionary/models/add-contractors-card-modal-data';

@Injectable({ providedIn: 'root' })
export class ContractorsDictionaryPopupService {
	constructor(private readonly popup: SharedPopupService) {}

	public openCreateContractorsCardModal(): ModalRef {
		return this.popup.openModal<IAddContractorsCardModalData>(
			CreateContractorsCardModalComponent,
			{ id: 1234 },
			true,
			'661px'
		);
	}
}
