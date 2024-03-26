import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransportApiService } from '@app/core/api/transport-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITransportNotifyDto } from '@app/core/models/company/transport-notify-dto';

@UntilDestroy()
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
		dateFrom: FormControl<Date | null>;
		dateTo: FormControl<Date | null>;
	}>;

	public constructor(
		private readonly modal: NzModalRef,
		private readonly apiService: TransportApiService,
	) {
		this.noteForm = new FormGroup({
			dateFrom: new FormControl(new Date(), Validators.required),
			dateTo: new FormControl(new Date(), Validators.required),
			note: new FormControl('', Validators.required),
		});
	}

	public saveAndCloseModal(): void {
		const transportNotify: ITransportNotifyDto = {
			dateFrom: this.noteForm.controls.dateFrom.value?.toISOString(),
			dateTo: this.noteForm.controls.dateTo.value?.toISOString(),
			note: this.noteForm.controls.note.value?.toString(),
		};

		this.apiService
			.sendTransportNote(transportNotify)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: () => {
					this.modal.destroy(this.noteForm.value);
				},
				error: (error: unknown) => {
					console.error('Уведомление не опубликовано', error);
				},
			});
	}

	public disabledDate = (current: Date): boolean => current < new Date();
	public disabledBeforeFrom = (current: Date): boolean =>
		current < (this.noteForm.controls.dateFrom.value || Date.now());
}
