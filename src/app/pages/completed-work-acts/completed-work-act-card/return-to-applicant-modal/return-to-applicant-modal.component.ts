import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { CommonModule, NgIf } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { CardComponent } from '@app/shared/components/card/card.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';

interface IDialogData {
	title?: string;
	okButton?: string;
}
@Component({
	selector: 'ss-return-to-applicant-modal',
	templateUrl: './return-to-applicant-modal.component.html',
	styleUrls: ['./return-to-applicant-modal.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CardComponent,
		IconComponent,
		HeadlineComponent,
		TextareaComponent,
		ButtonComponent,
	],
})
export class ReturnToApplicantModalComponent {
	protected commentForm!: FormGroup<{
		comment: FormControl<string | null>;
	}>;

	public title = '';
	public okButton = 'Да';

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: IDialogData
	) {
		if (data.title) {
			this.title = data.title;
		}

		if (data.okButton) {
			this.okButton = data.okButton;
		}

		this.commentForm = new FormGroup({
			comment: new FormControl<string>('', Validators.required),
		});
	}

	public close() {
		this.modalRef.close();
	}

	public apply() {
		this.commentForm.markAllAsTouched();

		if (!this.commentForm.invalid) {
			this.modalRef.close(this.commentForm.controls.comment.value);
		}
	}
}
