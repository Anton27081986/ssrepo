import {
	ChangeDetectorRef,
	Component,
	inject,
	Signal,
	ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	OperationPlanItem,
	PlanDays,
} from '@app/core/models/production-plan/operation-plan';
import {
	Align,
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	IconPosition,
	DropdownListComponent,
	ExtraSize,
	IconType,
	PopoverTriggerForDirective,
	SsTableState,
	TableCellDirective,
	TdComponent,
	TextComponent,
	TextType,
	TextWeight,
	TrComponent,
} from '@front-library/components';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { AddCommentsModalComponent } from '@app/pages/production-plan/modal/add-comments-modal/add-comments-modal.component';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { CreateCommentsModalComponent } from '@app/pages/production-plan/modal/create-comments-modal/create-comments-modal.component';

export const BASE_COLUMN_MAP: Record<
	keyof Pick<
		OperationPlanItem,
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
	(row: OperationPlanItem) => string | number
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
	selector: 'tbody[app-operation-plan-table-tbody]',
	standalone: true,
	imports: [
		CheckboxComponent,
		ReactiveFormsModule,
		TdComponent,
		TextComponent,
		TableCellDirective,
		TrComponent,
		AddCommentsModalComponent,
		ButtonComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		ButtonComponent,
		CreateCommentsModalComponent,
	],
	templateUrl: './operation-plan-table-tbody.component.html',
	styleUrl: './operation-plan-table-tbody.component.scss',
})
@UntilDestroy()
export class OperationPlanTableTbodyComponent {
	@ViewChild('getCommentsList') commentsComp!: AddCommentsModalComponent;

	private readonly tableStateService =
		inject<SsTableState<OperationPlanItem>>(SsTableState);

	public data: Signal<OperationPlanItem[] | undefined> =
		this.tableStateService.data;

	private readonly operationPlanService = inject(OperationPlanService);

	private readonly popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	protected readonly operationPlanState = inject(OperationPlanState);

	public readonly visibleColumns = this.tableStateService.visibleColumns;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;
	protected readonly TextType = TextType;
	protected readonly IconType = IconType;

	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly ExtraSize = ExtraSize;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

	public getRowCheckboxControl(index: number): FormControl {
		return this.tableStateService.getRowCheckboxControl(index);
	}

	protected editPlanFact(
		event: Event,
		row: OperationPlanItem,
		columnId: string,
	): void {
		const input = event.target as HTMLInputElement;
		const newValue = input.value || null;
		const oldValue =
			this.getDayCell(row, columnId.replace('fact', 'plan')) ||
			this.getDayCell(row, columnId.replace('plan', 'fact'));

		console.log(oldValue);

		if (columnId.startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(row.id, {
						id: oldValue.id,
						planQuantity: newValue,
						factQuantity: oldValue.factQuantity,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekPlanQuantity = r.weekPlanQuantity;
						row.monthPlanQuantity = r.monthPlanQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(row.id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						planQuantity: newValue,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekPlanQuantity = r.weekPlanQuantity;
						row.monthPlanQuantity = r.monthPlanQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			}
		}

		if (columnId.startsWith('fact')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(row.id, {
						id: oldValue.id,
						factQuantity: newValue,
						planQuantity: oldValue.planQuantity,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekFactQuantity = r.weekFactQuantity;
						row.monthFactQuantity = r.monthFactQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(row.id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						factQuantity: newValue,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekFactQuantity = r.weekFactQuantity;
						row.monthFactQuantity = r.monthFactQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			}
		}
	}
	protected openPostponePlanModal(row: OperationPlanItem) {
		this.popupService.openPostponePlanModal(47);
	}

	public onCommentsOpen(opened: boolean): void {
		if (opened) {
			this.commentsComp.loadCommentsList();
		}
	}

	public getCellValue(
		row: OperationPlanItem,
		columnId: string,
	): string | number {
		// 1. Базовые колонки
		const baseFieldHandler =
			BASE_COLUMN_MAP[columnId as keyof typeof BASE_COLUMN_MAP];

		if (baseFieldHandler) {
			return baseFieldHandler(row);
		}

		// 2. Динамические колонки по дням
		const planMatch = columnId.match(
			/^planQuantity-(\d{4})-(\d{2})-(\d{2})$/,
		);
		const factMatch = columnId.match(
			/^factQuantity-(\d{4})-(\d{2})-(\d{2})$/,
		);

		if (planMatch || factMatch) {
			const [, , month, day] = planMatch || factMatch!;

			const planDay = row.planDays?.find((dayObj) => {
				const [, m, d] = dayObj.date.slice(0, 10).split('-');

				return m === month && d === day;
			});

			if (!planDay) {
				return '';
			}

			if (planMatch) {
				return planDay.planQuantity;
			}

			if (factMatch) {
				return planDay.factQuantity;
			}
		}

		// 3. Если не попали ни в одну категорию — пусто
		return '';
	}

	public getDayCell(
		row: OperationPlanItem,
		columnId: string,
	): PlanDays | null {
		const planMatch = columnId.match(
			/^planQuantity-(\d{4})-(\d{2})-(\d{2})$/,
		);
		const factMatch = columnId.match(
			/^factQuantity-(\d{4})-(\d{2})-(\d{2})$/,
		);

		if (planMatch || factMatch) {
			const [, , month, day] = planMatch || factMatch!;

			const planDay = row.planDays?.find((dayObj) => {
				const [, m, d] = dayObj.date.slice(0, 10).split('-');

				return m === month && d === day;
			});

			if (!planDay) {
				return null;
			}

			if (planMatch) {
				return planDay;
			}

			if (factMatch) {
				return planDay;
			}
		}

		return null;
	}
}
