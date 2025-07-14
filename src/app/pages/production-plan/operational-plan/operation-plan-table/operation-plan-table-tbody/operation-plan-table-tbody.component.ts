import { ChangeDetectorRef, Component, inject, Signal } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	OperationPlanItem,
	PlanDays,
} from '@app/core/models/production-plan/operation-plan';
import {
	Align,
	CheckboxComponent,
	IconComponent,
	IconType,
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
import { NgIf } from '@angular/common';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';

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
		IconComponent,
		AddCommentsModalComponent,
		NgIf,
	],
	templateUrl: './operation-plan-table-tbody.component.html',
	styleUrl: './operation-plan-table-tbody.component.scss',
})
@UntilDestroy()
export class OperationPlanTableTbodyComponent {
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

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

	public getRowCheckboxControl(index: number): FormControl {
		return this.tableStateService.getRowCheckboxControl(index);
	}

	// protected openPostponePlanModal(row: OperationPlanItem): void {
	// 	this.popupService.openPostponePlanModal(row.id);
	// }

	protected editPlanFact(
		event: Event,
		row: OperationPlanItem,
		columnId: string,
	): void {
		const input = event.target as HTMLInputElement;
		const newValue = input.value || null;
		const oldValue = this.getDayCell(row, columnId);

		if (columnId.startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(row.id, {
						id: oldValue.id,
						planQuantity: newValue,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekPlanQuantity = r.weekPlanQuantity;
						row.monthPlanQuantity = r.monthPlanQuantity;
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
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekFactQuantity = r.weekFactQuantity;
						row.monthFactQuantity = r.monthFactQuantity;
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
						this.changeDetectorRef.detectChanges();
					});
			}
		}
	}

	// public openCreateCommentsModal(row: OperationPlanItem) {
	// 	this.popupService.openCreateCommentsModal(row.id);
	// }
	//
	// public openAddCommentsModal(row: OperationPlanItem) {
	// 	this.popupService.openAddCommentsModal(row.id);
	protected openPostponePlanModal(row: OperationPlanItem) {
		this.popupService.openPostponePlanModal(47);
	}

	public openCommentsModal(row: OperationPlanItem) {
		row.isComment
			? this.popupService.openAddCommentsModal(row.id)
			: this.popupService.openCreateCommentsModal(row.id);
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
