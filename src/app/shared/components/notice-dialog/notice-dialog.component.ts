import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import {
	ButtonComponent,
	ButtonType,
	Size,
} from '@front-components/components';
import { CardComponent } from '@app/shared/components/card/card.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { NgIf } from '@angular/common';

interface NoticeDialogData {
	header: string;
	text: string;
	type: 'Default' | 'Warning' | 'Error';
	buttonOk: string | undefined;
	buttonCancel: string;
}

@Component({
	selector: 'ss-dialog',
	templateUrl: './notice-dialog.component.html',
	styleUrls: ['./notice-dialog.component.scss'],
	imports: [
		CardComponent,
		IconComponent,
		HeadlineComponent,
		TextComponent,
		ButtonComponent,
		NgIf,
	],
	standalone: true,
})
export class NoticeDialogComponent {
	public header: string | undefined;
	public text: string | undefined;
	public type: 'Default' | 'Warning' | 'Error' = 'Default';
	protected buttonOk = 'Понятно';
	protected buttonCancel: string | undefined;

	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: NoticeDialogData,
	) {
		if (!data) {
			return;
		}

		this.header = data.header;
		this.text = data.text;
		this.type = data.type;
		this.buttonCancel = data.buttonCancel;

		if (data.buttonOk) {
			this.buttonOk = data.buttonOk;
		}
	}

	close(result: boolean) {
		this.modalRef.close(result);
	}
}
