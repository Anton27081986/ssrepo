import { Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';

@Component({
	selector: 'app-client-proposals-send-cloud-popover',
	styleUrls: ['client-proposals-send-cloud-popover.component.scss'],
	templateUrl: './client-proposals-send-cloud-popover.component.html',
})
export class ClientProposalsSendCloudPopoverComponent {
	constructor(private readonly modalRef: ModalRef) {}

	protected close() {
		this.modalRef.close();
	}
}
