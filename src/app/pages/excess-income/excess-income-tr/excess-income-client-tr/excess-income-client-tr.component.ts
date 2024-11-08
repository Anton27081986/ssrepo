import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { rotateAnimation } from '@app/core/animations';

export enum ExcessIncomeClientRowItemField {
	client = 'client',
	contractors = 'contractors',
	otsr = 'otsr',
	comments = 'comments',
	nameGroups = 'nameGroups',
	nameTov = 'nameTov',
	priceCurrent = 'priceCurrent',
	sndCurrent = 'sndCurrent',
	priceFixCurrent = 'priceFixCurrent',
	priceCalculateCurrent = 'priceCalculateCurrent',
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

	constructor(protected readonly columnsStateService: ColumnsStateService) {}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	expended() {
		this.client().expended$.next(!this.client().expended$.value);
	}
}
