import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

interface DialogData {
	text: string;
	title?: string;
}

@Component({
	selector: 'ss-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
	public text: string | undefined;
	public title: string | undefined;

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: DialogData,
	) {
		if (!data.text) {
			return;
		}

		if (data.title) {
			this.title = data.title;
		}

		this.text = data.text;
	}

	close(status: boolean = false) {
		this.modalRef.close(status);
	}
}
