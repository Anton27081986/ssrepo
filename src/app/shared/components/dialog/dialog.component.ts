import { Component, Inject, Input } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { CardComponent } from '@app/shared/components/card/card.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';

interface DialogData {
	header: string;
	text: string;
	oneButton: boolean;
}

@Component({
	selector: 'ss-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
	imports: [CardComponent, HeadlineComponent, TextComponent, ButtonComponent],
	standalone: true,
})
export class DialogComponent {
	public header: string | undefined;
	public text: string | undefined;
	public oneButton = false;
	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: DialogData
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
