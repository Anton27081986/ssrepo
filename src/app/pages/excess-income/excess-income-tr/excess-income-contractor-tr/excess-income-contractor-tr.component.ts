import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { ContractorNodeState } from '@app/pages/excess-income/excess-income-state/contractor-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import {
	LinkComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import {
	AsyncPipe,
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common';

@Component({
	selector: 'tr[excess-income-contractor-tr]',
	templateUrl: './excess-income-contractor-tr.component.html',
	styleUrls: ['./excess-income-contractor-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		LinkComponent,
		TextComponent,
		NgSwitchDefault,
	],
	standalone: true,
})
export class ExcessIncomeContractorTrComponent {
	public contractor: InputSignal<ContractorNodeState> =
		input.required<ContractorNodeState>();

	protected readonly ExcessIncomeClientRowItemField =
		ExcessIncomeClientRowItemField;

	protected readonly Text = Text;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	constructor(protected readonly columnsStateService: ColumnsStateService) {}
}
