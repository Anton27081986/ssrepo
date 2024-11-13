import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';

@Component({
	selector: 'tr[excess-income-tov-tr]',
	templateUrl: './excess-income-tov-tr.component.html',
	styleUrls: ['./excess-income-tov-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeTovTrComponent {
	public tov: InputSignal<TovNodeState> = input.required<TovNodeState>();

	constructor(protected readonly columnsStateService: ColumnsStateService) {}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;
}
