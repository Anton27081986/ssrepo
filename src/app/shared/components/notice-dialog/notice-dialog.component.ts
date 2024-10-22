import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

interface NoticeDialogData {
	header: string;
	text: string;
	type: 'Default' | 'Warning' | 'Error';
}

@Component({
	selector: 'ss-dialog',
	templateUrl: './notice-dialog.component.html',
	styleUrls: ['./notice-dialog.component.scss'],
})
export class NoticeDialogComponent {
	public header: string | undefined;
	public text: string | undefined;
	public type: 'Default' | 'Warning' | 'Error' = 'Default';
	constructor(
		private modalRef: ModalRef,
		@Inject(DIALOG_DATA) private data: NoticeDialogData,
	) {
		if (!data) {
			return;
		}

		this.header = data.header;
		this.text = data.text;
		this.type = data.type;
	}

	close() {
		this.modalRef.close();
	}
}
