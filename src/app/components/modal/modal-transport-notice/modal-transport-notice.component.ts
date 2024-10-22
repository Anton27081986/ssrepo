import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRef } from '@app/core/modal/modal.ref';
import { SSForm } from '@app/core/models/form';
import { dateFromLessDateTo } from '@app/core/validators/date-from-less-date-to';
import { ModalTransportNoticeImports } from '@app/components/modal/modal-transport-notice/modal-transport-notice.imports';
import { ITransportNotifyDto } from '@app/core/models/company/transport-notify-dto';

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
	imports: [ModalTransportNoticeImports],
})
export class ModalTransportNoticeComponent {
	private readonly modalRef = inject(ModalRef);
	protected noteForm = new FormGroup<SSForm<INoteForm>>(
		{
			dateFrom: new FormControl<Date | null>(null, {
				nonNullable: true,
				validators: Validators.required,
			}),
			dateTo: new FormControl<Date | null>(null, {
				nonNullable: true,
				validators: Validators.required,
			}),
			note: new FormControl<string>('', [Validators.required]),
		},
		{ validators: dateFromLessDateTo('dateFrom', 'dateTo') },
	);

	public saveAndCloseModal(): void {
		const transportNotify: ITransportNotifyDto = {
			dateFrom: new Date(this.noteForm.controls.dateFrom?.value).toISOString(),
			dateTo: new Date(this.noteForm.controls.dateTo?.value).toISOString(),
			note: this.noteForm.controls.note?.value?.toString(),
		};

		this.modalRef.close(transportNotify);
	}

	public close() {
		this.modalRef.close();
	}
}
