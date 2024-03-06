import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransportApiService } from '@app/core/api/transport-api.service';

@Component({
	selector: 'app-modal-transport-notice',
	templateUrl: './modal-transport-notice.component.html',
	styleUrls: ['./modal-transport-notice.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalTransportNoticeComponent {
	protected readonly Date = Date;
	protected readonly formatDate = formatDate;
	protected noteForm: FormGroup<{
		note: FormControl<string | null>;
		dFrom: FormControl<Date | null>;
		dTo: FormControl<Date | null>;
	}>;

	public constructor(
		private readonly modal: NzModalRef,
		private readonly apiService: TransportApiService,
	) {
		this.noteForm = new FormGroup({
			dFrom: new FormControl(new Date(), Validators.required),
			dTo: new FormControl(new Date(), Validators.required),
			note: new FormControl('', Validators.required),
		});
	}

	public closeModal(): void {
		this.modal.destroy();
	}

	public saveAndCloseModal(): void {
		this.apiService
			.sendTransportNote(
				this.noteForm.controls.dFrom.value?.toISOString(),
				this.noteForm.controls.dTo.value?.toISOString(),
				this.noteForm.controls.note.value?.toString(),
			)
			.subscribe(
				() => {
					this.modal.destroy(this.noteForm.value);
				},
				(error: unknown) => {
					console.error('Уведомление не опубликовано', error);
				},
			);
	}

	public disabledDate = (current: Date): boolean => current < new Date();
	public disabledBeforeFrom = (current: Date): boolean =>
		current < (this.noteForm.controls.dFrom.value || Date.now());
}
