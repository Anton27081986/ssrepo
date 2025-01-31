import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import {CardComponent} from "@app/shared/components/card/card.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {CommonModule, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

interface DialogData {
	text: string;
	title?: string;
}

@Component({
	selector: 'ss-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		IconComponent,
		HeadlineComponent,
		NgIf,
		TextComponent,
		ButtonComponent
	],
	standalone: true
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
