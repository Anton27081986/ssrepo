import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ExcessIncomeSndClientRowItemField } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { ExcessIncomeUpdateClientTovGroupItem } from '@app/core/models/excess-income/excess-income-update-client-tov-group-item';
import { ExcessIncomeUpdateTovGroupState } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-state';
import {
	ButtonComponent,
	ButtonType,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	InputType,
	Size,
	TextComponent,
	TextType,
} from '@front-components/components';
import {
	AsyncPipe,
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'tr[excess-income-update-tov-group-tr]',
	templateUrl: './excess-income-update-tov-group-tr.component.html',
	styleUrls: ['./excess-income-update-tov-group-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		TextComponent,
		NgSwitchCase,
		NgIf,
		FormFieldComponent,
		InputComponent,
		ReactiveFormsModule,
		ButtonComponent,
		FieldCtrlDirective,
	],
	standalone: true,
})
export class ExcessIncomeUpdateTovGroupTrComponent {
	public tovGroup = input.required<ExcessIncomeUpdateClientTovGroupItem>();
	protected readonly ExcessIncomeSndClientRowItemField =
		ExcessIncomeSndClientRowItemField;

	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly InputType = InputType;
	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly state: ExcessIncomeUpdateTovGroupState,
	) {}

	protected readonly IconPosition = IconPosition;
	protected delTovGroupsState(id: number) {
		this.state.delTovGroups(id);
	}

	protected readonly TextType = TextType;
}
