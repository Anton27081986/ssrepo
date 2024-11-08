import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';

@Component({
	selector: 'tr[excess-income-group-tr]',
	templateUrl: './excess-income-group-tr.component.html',
	styleUrls: ['./excess-income-group-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeGroupTrComponent {
	public group: InputSignal<GroupNodeState> = input.required<GroupNodeState>();

	constructor(protected readonly columnsStateService: ColumnsStateService) {}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	expended() {
		this.group().expended$.next(!this.group().expended$.value);
	}
}
