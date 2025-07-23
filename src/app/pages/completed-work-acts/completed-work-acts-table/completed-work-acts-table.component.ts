import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
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
	LinkComponent,
	SsTableState,
	TableCellDirective,
	TableDirective,
	TableHeadDirective,
	TableThGroupComponent,
	TdComponent,
	TextComponent,
	TextType,
	TextWeight,
	ThComponent, TooltipDirective,
	TooltipPosition,
	TrComponent,
} from '@front-library/components';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { columnCompletedWorkActsConfigs } from '@app/pages/completed-work-acts/completed-work-acts-table/column-config';
import { DatePipe } from '@angular/common';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';

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
		DatePipe,
		LinkComponent,
		TooltipDirective,
	],
	templateUrl: './completed-work-acts-table.component.html',
	styleUrl: './completed-work-acts-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CompletedWorkActsTableComponent {
	private readonly tableStateService = inject(SsTableState);

	private readonly completedWorkActsFacade: CompletedWorkActsFacadeService =
		inject(CompletedWorkActsFacadeService);

	public actsItems: InputSignal<ICompletedWorkAct[]> = input.required();
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

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		effect(() => {
			this.tableStateService.initialize(
				this.actsItems(),
				columnCompletedWorkActsConfigs
			);
		});
	}

	public openAct(id: string) {
		if (id) {
			this.completedWorkActsFacade.getAct(id);
		}
	}
}
