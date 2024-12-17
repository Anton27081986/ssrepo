import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { ContractorNodeState } from '@app/pages/excess-income/excess-income-state/contractor-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { TextType } from '@front-components/components';

@Component({
	selector: 'tr[excess-income-contractor-tr]',
	templateUrl: './excess-income-contractor-tr.component.html',
	styleUrls: ['./excess-income-contractor-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeContractorTrComponent {
	public contractor: InputSignal<ContractorNodeState> = input.required<ContractorNodeState>();

	constructor(protected readonly columnsStateService: ColumnsStateService) {}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;
	protected readonly Text = Text;
	protected readonly TextType = TextType;
}
