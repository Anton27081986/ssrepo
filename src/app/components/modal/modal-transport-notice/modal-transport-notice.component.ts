import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from '@app/core/services/api.service';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators} from "@angular/forms";

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

	constructor(
		private readonly modal: NzModalRef,
		private readonly apiService: ApiService,
	) {
		this.noteForm = new FormGroup({
			dFrom: new FormControl(new Date(), Validators.required),
			dTo: new FormControl(new Date(), Validators.required),
			note: new FormControl('', Validators.required),
		});
	}

	closeModal(): void {
		this.modal.destroy();
	}

	saveAndCloseModal(): void {
		this.apiService
			.sendTransportNote(
				this.noteForm.controls.dFrom.value?.toISOString(),
				this.noteForm.controls.dTo.value?.toISOString(),
				this.noteForm.controls.note.value?.toString(),
			)
			.subscribe(
				() => {
					this.modal.destroy();
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
