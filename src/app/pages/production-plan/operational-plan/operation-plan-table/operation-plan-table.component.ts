import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	InputSignal,
	OnInit,
} from '@angular/core';
import {
	Align,
	ButtonComponent,
	CheckboxComponent,
	Colors,
	DraggableItemDirective,
	DropdownItemComponent,
	DropdownListComponent,
	IconComponent,
	LoadPaginationComponent,
	PopoverTriggerForDirective,
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
	TrComponent,
} from '@front-library/components';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OperationPlanItems } from '@app/core/models/production-plan/operation-plan';
import { generateColumnOperationPlanConfig } from '@app/pages/production-plan/operational-plan/operation-plan-table/generate-column-oper-plan-config';
import { DaysTotal } from '@app/core/utils/response';

export const BASE_COLUMN_MAP: Record<
	keyof Pick<
		OperationPlanItems,
		| 'tov'
		| 'tovCategory'
		| 'productionSection'
		| 'optimalBatch'
		| 'productionType'
		| 'productionCity'
		| 'productManagerUser'
		| 'planEconomicUser'
		| 'weekPlanQuantity'
		| 'weekFactQuantity'
		| 'monthPlanQuantity'
		| 'monthFactQuantity'
	>,
	(row: OperationPlanItems) => string | number
> = {
	tov: (row) => row.tov.name,
	tovCategory: (row) => row.tovCategory.name,
	productionSection: (row) => row.productionSection.name,
	optimalBatch: (row) => row.optimalBatch,
	productionType: (row) => row.productionType.name,
	productionCity: (row) => row.productionCity.name,
	productManagerUser: (row) => row.productManagerUser.name,
	planEconomicUser: (row) => row.planEconomicUser.name,
	weekPlanQuantity: (row) => row.weekPlanQuantity,
	weekFactQuantity: (row) => row.weekFactQuantity,
	monthPlanQuantity: (row) => row.monthPlanQuantity,
	monthFactQuantity: (row) => row.monthFactQuantity,
};

@Component({
	selector: 'app-operation-plan-table',
	standalone: true,
	imports: [
		ButtonComponent,
		FiltersTableCanvasComponent,
		FiltersTriggerButtonComponent,
		LoadPaginationComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		NgFor,
		NgIf,
		AsyncPipe,
		IconComponent,
		TableDirective,
		TableThGroupComponent,
		ThComponent,
		CheckboxComponent,
		ReactiveFormsModule,
		TextComponent,
		TableHeadDirective,
		NgClass,
		TrComponent,
		DraggableItemDirective,
		TableCellDirective,
		TdComponent,
	],
	templateUrl: './operation-plan-table.component.html',
	styleUrl: './operation-plan-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [SsTableState],
})
export class OperationPlanTableComponent implements OnInit {
	private readonly tableStateService = inject(SsTableState);
	public planItems: InputSignal<OperationPlanItems[]> = input.required();

	public daysTotal: InputSignal<DaysTotal[]> = input.required();

	public readonly data = this.tableStateService.data;
	public readonly dropdownColumns = this.tableStateService.dropdownColumns;
	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly visibleColumns = this.tableStateService.visibleColumns;

	public readonly masterCheckboxCtrl =
		this.tableStateService.getMasterCheckboxCtrl();

	public readonly dropdownColumnsVisible = computed(() =>
		this.dropdownColumns().filter((item) => item.visible),
	);

	public readonly dropdownColumnsUnVisible = computed(() =>
		this.dropdownColumns().filter((item) => !item.visible),
	);

	public readonly rowCheckboxes = this.tableStateService.getRowCheckboxes();
	public readonly columnsForm = this.tableStateService.getColumnsForm();
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Align = Align;

	ngOnInit() {
		this.initializeData();
	}

	private initializeData(): void {
		const columnOperPlanConfig = generateColumnOperationPlanConfig(
			this.planItems(),
		);
		this.tableStateService.initialize(
			this.planItems(),
			columnOperPlanConfig,
		);
		console.log(this.data(), this.planItems());
	}

	// Проверяем, является ли колонка подколонкой
	public isSubColumn(columnId: string): boolean {
		return this.visibleColumns().some(
			(column) =>
				column.subColumns && column.subColumns.includes(columnId),
		);
	}

	public getMasterCheckboxIndeterminate(): boolean {
		return this.tableStateService.isMasterCheckboxIndeterminate();
	}

	public formatColumnName(name: string): string {
		if (name.match(/^\d{2}-\d{2}$/)) {
			const [month, day] = name.split('-');

			return `${day}.${month}`;
		}

		return name;
	}

	public getRowCheckboxControl(index: number): FormControl {
		return this.tableStateService.getRowCheckboxControl(index);
	}

	public getSubColumnName(subColumnId: string): string {
		if (subColumnId.startsWith('planQuantity')) {
			return 'План';
		}

		if (subColumnId.startsWith('factQuantity')) {
			return 'Факт';
		}

		return subColumnId;
	}

	public getCellValue(
		row: OperationPlanItems,
		columnId: string,
	): string | number {
		const baseFieldHandler =
			BASE_COLUMN_MAP[columnId as keyof typeof BASE_COLUMN_MAP];

		if (baseFieldHandler) {
			return baseFieldHandler(row);
		}

		if (
			columnId.startsWith('planQuantity-') ||
			columnId.startsWith('factQuantity-')
		) {
			const [, date] = columnId.split('-'); // e.g., 'planQuantity-06-23' -> ['', '06-23']
			const formattedDate = `2025-${date}`; // Assuming year 2025 as per data
			if (row.planDays) {
				const planDay = row.planDays.find((day) =>
					day.date.startsWith(formattedDate),
				);

				if (planDay) {
					return columnId.startsWith('planQuantity-')
						? planDay.planQuantity
						: planDay.factQuantity;
				}
			}
		}

		return '';
	}
}
