import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRef } from '@app/core/modal/modal.ref';
import { SSForm } from '@app/core/models/form';
import { dateFromLessDateTo } from '@app/core/validators/date-from-less-date-to';
import { ModalTransportNoticeImports } from '@app/components/modal/modal-transport-notice/modal-transport-notice.imports';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

interface INoteForm {
	dateFrom: Date | null;
	dateTo: Date | null;
	note: string;
}

@Component({
	selector: 'app-modal-transport-notice',
	templateUrl: './modal-transport-notice.component.html',
	styleUrls: ['./modal-transport-notice.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ModalTransportNoticeImports, CardComponent, TextComponent, IconComponent, SsDividerComponent, TextareaComponent, ButtonComponent],
})
export class ModalTransportNoticeComponent {
	private readonly modalRef = inject(ModalRef);
	protected noteForm = new FormGroup<SSForm<INoteForm>>(
		{
			dateFrom: new FormControl<string>('', {
				nonNullable: true,
				validators: Validators.required,
			}),
			dateTo: new FormControl<string>('', {
				nonNullable: true,
				validators: Validators.required,
			}),
			note: new FormControl<string>('', [Validators.required]),
		},
		{ validators: dateFromLessDateTo('dateFrom', 'dateTo') },
	);

	public saveAndCloseModal(): void {
		this.modalRef.close(this.noteForm.value);
	}

	public close(): void {
		this.modalRef.close();
	}
}
