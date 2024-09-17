import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

interface DialogData {
	header: string;
	text: string;
	oneButton: boolean;
}

@Component({
	selector: 'ss-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
	public header: string | undefined;
	public text: string | undefined;
	public oneButton: boolean = false;
	constructor(
		private modalRef: ModalRef,
		@Inject(DIALOG_DATA) private data: DialogData,
	) {
		if (!data) {
			return;
		}

		this.header = data.header;
		this.text = data.text;
		this.oneButton = data.oneButton;
	}

	close(status: boolean) {
		this.modalRef.close(status);
	}
}
