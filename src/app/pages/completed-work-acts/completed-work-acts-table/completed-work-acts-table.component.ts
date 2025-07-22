import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	InputSignal,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	Align,
	ButtonComponent,
	CheckboxComponent,
	Colors,
	SsTableState,
	TableCellDirective,
	TableDirective,
	TableHeadDirective,
	TableThGroupComponent,
	TdComponent,
	TextComponent,
	TextType,
	TextWeight,
	ThComponent,
	TooltipPosition,
	TrComponent,
} from '@front-library/components';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';

@Component({
	selector: 'app-completed-work-acts-table',
	standalone: true,
	imports: [
		TableDirective,
		TableHeadDirective,
		TableThGroupComponent,
		TextComponent,
		ThComponent,
		ButtonComponent,
		CheckboxComponent,
		TableCellDirective,
		TdComponent,
		TrComponent,
	],
	templateUrl: './completed-work-acts-table.component.html',
	styleUrl: './completed-work-acts-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CompletedWorkActsTableComponent {
	private readonly tableStateService = inject(SsTableState);

	public planItems: InputSignal<ICompletedWorkAct[]> = input.required();
	public total: InputSignal<number> = input.required();
	public totalItems: InputSignal<number> = input.required();

	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly data = this.tableStateService.data;
	public readonly visibleColumns = this.tableStateService.visibleColumns;

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;
	protected readonly TextType = TextType;
}
