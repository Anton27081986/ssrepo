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
	ThComponent,
	TooltipDirective,
	TooltipPosition,
	TrComponent,
} from '@front-library/components';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { columnCompletedWorkActsConfigs } from '@app/pages/completed-work-acts/completed-work-acts-table/column-config';
import { DatePipe } from '@angular/common';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { TableColumnConfig } from '@front-library/components/lib/components/table/models';

@Component({
	selector: 'app-completed-work-acts-table',
	standalone: true,
	imports: [
		TableDirective,
		TableHeadDirective,
		TableThGroupComponent,
		TextComponent,
		ThComponent,
		TableCellDirective,
		TdComponent,
		TrComponent,
		DatePipe,
		LinkComponent,
		TooltipDirective,
		NumWithSpacesPipe,
	],
	templateUrl: './completed-work-acts-table.component.html',
	styleUrl: './completed-work-acts-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CompletedWorkActsTableComponent {
	private readonly storageName: string = 'CWA-table-config';
	private readonly tableStateService = inject(SsTableState);

	private readonly completedWorkActsFacade: CompletedWorkActsFacadeService =
		inject(CompletedWorkActsFacadeService);

	private readonly localStorageService: LocalStorageService =
		inject(LocalStorageService);

	private readonly router: Router = inject(Router);

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

	protected savedConfig: TableColumnConfig[] | null =
		this.localStorageService.getItem<TableColumnConfig[] | null>(
			this.storageName
		);

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		effect(() => {
			this.tableStateService.initialize(
				this.actsItems(),
				this.savedConfig || columnCompletedWorkActsConfigs
			);
		});

		effect(() => {
			this.localStorageService.setItem(
				this.storageName,
				this.tableStateService.visibleColumns()
			);

			this.savedConfig = [...this.tableStateService.visibleColumns()];
		});
	}

	public openAct(id: string): void {
		if (id) {
			const url = this.router.serializeUrl(
				this.router.createUrlTree(['completed-work-acts', `${id}`])
			);

			window.open(url, '_blank');
		}
	}
}
