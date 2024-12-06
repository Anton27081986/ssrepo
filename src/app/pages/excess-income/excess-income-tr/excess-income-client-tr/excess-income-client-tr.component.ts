import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { rotateAnimation } from '@app/core/animations';
import { ModalService } from '@app/core/modal/modal.service';
import { ExcessIncomeUpdateSndClientPopoverComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { IconType } from '@front-components/components';

export enum ExcessIncomeClientRowItemField {
	client = 'client',
	contractors = 'contractors',
	otsr = 'otsr',
	comments = 'comments',
	nameGroups = 'nameGroups',
	nameTov = 'nameTov',
	current = 'current',
	priceCurrent = 'priceCurrent',
	sndCurrent = 'sndCurrent',
	priceFixCurrent = 'priceFixCurrent',
	priceCalculateCurrent = 'priceCalculateCurrent',
	next = 'next',
	priceNext = 'currentIntervalNext',
	sndNext = 'sndNext',
	priceFixNext = 'priceFixNext',
	priceCalculateNext = 'priceCalculateNext',
	actions = 'actions',
}

@Component({
	selector: 'tr[excess-income-client-tr]',
	templateUrl: './excess-income-client-tr.component.html',
	styleUrls: ['./excess-income-client-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeClientTrComponent {
	public client: InputSignal<ClientNodeState> = input.required<ClientNodeState>();

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly modalService: ModalService,
		private readonly state: ExcessIncomeState,
	) {}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	openUpdateClientPriceModal(isCurrent: boolean) {
		this.modalService.open(ExcessIncomeUpdateSndClientPopoverComponent, {
			data: { client: this.client().client, isCurrent: isCurrent, state: this.state },
		});
	}

	protected readonly IconType = IconType;
}
