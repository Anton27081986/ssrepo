import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ExcessIncomeSndClientRowItemField } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { numberInputTextMask } from '@app/core/utils/mask';
import { ExcessIncomeUpdateClientTovGroupItem } from '@app/core/models/excess-income/excess-income-update-client-tov-group-item';
import { ExcessIncomeUpdateTovGroupState } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-state';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'tr[excess-income-update-tov-group-tr]',
	templateUrl: './excess-income-update-tov-group-tr.component.html',
	styleUrls: ['./excess-income-update-tov-group-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeUpdateTovGroupTrComponent {
	public tovGroup = input.required<ExcessIncomeUpdateClientTovGroupItem>();
	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly state: ExcessIncomeUpdateTovGroupState,
	) {}

	protected readonly ExcessIncomeSndClientRowItemField = ExcessIncomeSndClientRowItemField;
	protected readonly numberInputTextMask = numberInputTextMask;

	protected delTovGroupsState(id: number) {
		this.state.delTovGroups(id);
	}
}
