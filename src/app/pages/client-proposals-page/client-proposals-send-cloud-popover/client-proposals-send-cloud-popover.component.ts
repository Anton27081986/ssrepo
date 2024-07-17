import { Component, Inject, OnInit } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { BehaviorSubject } from 'rxjs';

interface UrlData {
	url: string;
}

@Component({
	selector: 'app-client-proposals-send-cloud-popover',
	styleUrls: ['client-proposals-send-cloud-popover.component.scss'],
	templateUrl: './client-proposals-send-cloud-popover.component.html',
})
export class ClientProposalsSendCloudPopoverComponent implements OnInit {
	protected url: string = '';
	protected readonly url$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: UrlData,
	) {}

	protected close() {
		this.modalRef.close();
	}

	ngOnInit() {
		this.url$.next(this.data.url);
	}
}
