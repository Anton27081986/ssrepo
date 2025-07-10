import {
	ChangeDetectionStrategy,
	Component,
	inject, Injector,
	input,
	InputSignal, ViewContainerRef,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { OperationPlanItem } from '@app/core/models/production-plan/operation-plan';
import {
	Align,
	CheckboxComponent,
	IconComponent,
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
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { AddCommentsModalComponent } from '@app/pages/production-plan/modal/add-comments-modal/add-comments-modal.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';

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
	],
	templateUrl: './operation-plan-table-tbody.component.html',
	styleUrl: './operation-plan-table-tbody.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class OperationPlanTableTbodyComponent {
	private readonly tableStateService = inject(SsTableState);
	public readonly data = this.tableStateService.data;

	private popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	public readonly visibleColumns = this.tableStateService.visibleColumns;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;
	protected readonly TextType = TextType;

	constructor() {}

	public getRowCheckboxControl(index: number): FormControl {
		return this.tableStateService.getRowCheckboxControl(index);
	}

	protected openPostponePlanModal(row: OperationPlanItem) {
		this.popupService.openPostponePlanModal(row.id);
	}

	public openCreateCommentsModal(row: OperationPlanItem) {
		this.popupService.openCreateCommentsModal(row.id);
	}

	public openAddCommentsModal(row: OperationPlanItem) {
		this.popupService.openAddCommentsModal(row.id);
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
		const planMatch = columnId.match(/^planQuantity-(\d{2})-(\d{2})$/);
		const factMatch = columnId.match(/^factQuantity-(\d{2})-(\d{2})$/);

		if (planMatch || factMatch) {
			const [, month, day] = planMatch || factMatch!;

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

	protected readonly IconType = IconType;
}
