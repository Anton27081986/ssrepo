import { Component, Inject, OnInit } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { BehaviorSubject } from 'rxjs';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";

interface UrlData {
	url: string;
}

@Component({
	selector: 'app-client-proposals-send-cloud-popover',
	styleUrls: ['client-proposals-send-cloud-popover.component.scss'],
	templateUrl: './client-proposals-send-cloud-popover.component.html',
	imports: [
		CommonModule,
		HeadlineComponent,
		IconComponent,
		InputComponent,
		AsyncPipe,
		CdkCopyToClipboard,
		CaptionComponent
	],
	standalone: true
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
