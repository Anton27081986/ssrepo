import { ChangeDetectionStrategy, Component, Inject, input, InputSignal } from '@angular/core';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { rotateAnimation } from '@app/core/animations';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

export interface ExcessIncomeUpdateSndClientPopoverData {
	client: ExcessIncomeClient;
	interval: number;
}

@Component({
	selector: 'app-excess-income-update-snd-client-popover',
	templateUrl: './excess-income-update-snd-client-popover.component.html',
	styleUrls: ['./excess-income-update-snd-client-popover.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeUpdateSndClientPopoverComponent {
	protected client: ExcessIncomeClient;
	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) protected readonly data: ExcessIncomeUpdateSndClientPopoverData,
	) {
		this.client = this.data.client;
	}
}
