import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import { IResponse } from '@app/core/utils/response';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';

@Component({
	selector: 'app-excess-income-table',
	templateUrl: './excess-income-table.component.html',
	styleUrls: ['./excess-income-table.component.scss'],
	providers: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeTableComponent {
	public clients: InputSignal<ClientNodeState[]> =
		input.required<ClientNodeState[]>();
}
