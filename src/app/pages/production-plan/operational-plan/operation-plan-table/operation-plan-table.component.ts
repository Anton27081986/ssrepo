import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
	inject,
	input,
	InputSignal,
} from '@angular/core';
import {
	Align,
	ButtonType,
	CheckboxComponent,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconType,
	PopoverTriggerForDirective,
	SsTableState,
	TableDirective,
	TableHeadDirective,
	TableThGroupComponent,
	TextComponent,
	TextType,
	TextWeight,
	ThComponent,
	UtilityButtonComponent,
	TooltipDirective,
	TooltipPosition,
	StatusIconComponent,
	Status, ActionBarComponent, ActionBarItemComponent, ActionBarItemType,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { generateColumnOperationPlanConfig } from '@app/pages/production-plan/operational-plan/operation-plan-table/generate-column-oper-plan-config';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OperationPlanTableTbodyComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/operation-plan-table-tbody.component';
import {
	IDay,
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { UpdateRawMaterialsData } from '@app/pages/production-plan/modal/modal-update-raw-materials/modal-update-raw-materials.component';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { ApproveMaterialData } from '@app/pages/production-plan/modal/approve-material/approve-material.component';
import {
	OrderAnOutfit,
	OrderAnOutfitRequest,
} from '@app/core/models/production-plan/order-an-outfit-request';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
	selector: 'app-operation-plan-table',
	standalone: true,
    imports: [
        DropdownItemComponent,
        PopoverTriggerForDirective,
        DropdownListComponent,
        NgFor,
        TableDirective,
        TableThGroupComponent,
        ThComponent,
        CheckboxComponent,
        ReactiveFormsModule,
        TextComponent,
        TableHeadDirective,
        DatePipe,
        OperationPlanTableTbodyComponent,
        UtilityButtonComponent,
        NgIf,
        TooltipDirective,
        StatusIconComponent,
        ActionBarComponent,
        ActionBarItemComponent,
    ],
	templateUrl: './operation-plan-table.component.html',
	styleUrl: './operation-plan-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class OperationPlanTableComponent {
	private readonly tableStateService = inject(SsTableState);
	private readonly operationPlanPopup = inject(OperationPlanPopupService);
	private readonly operationPlanService = inject(OperationPlanService);
	protected readonly operationPlanState = inject(OperationPlanState);

	public planItems: InputSignal<OperationPlanItem[]> = input.required();
	public days: InputSignal<IDay[]> = input.required();
	public total: InputSignal<number> = input.required();
	public totalItems: InputSignal<number> = input.required();
	public planTooltipText =
		'Чтобы проверить общее количество готовой продукции, примените фильтр по участку';

	public productionSectionIds: number[] | null = null;

	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly data = this.tableStateService.data;
	public readonly visibleColumns = this.tableStateService.visibleColumns;

	public readonly masterCheckboxCtrl =
		this.tableStateService.getMasterCheckboxCtrl();

	public readonly rowCheckboxes = this.tableStateService.getRowCheckboxes();

	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Align = Align;

	public popupVisible = false;

	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly TooltipPosition = TooltipPosition;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		toSignal(
			this.masterCheckboxCtrl.valueChanges.pipe(
				tap((value: boolean | null) =>
					this.tableStateService.onMasterCheckboxChange(value)
				)
			)
		);

		toSignal(
			this.rowCheckboxes.valueChanges.pipe(
				tap((value) => {
					const count = value.filter((ctrl) => ctrl).length;

					if (count > 0 && !this.popupVisible) {
						this.popupVisible = true;
					}

					this.tableStateService.updateMasterCheckboxState();
				})
			)
		);

		effect(() => {
			const columnOperPlanConfig = generateColumnOperationPlanConfig(
				this.planItems(),
				this.days()
			);

			this.tableStateService.initialize(
				this.planItems(),
				columnOperPlanConfig
			);
		});

		this.operationPlanState.filterValueStore$.subscribe((filters) => {
			if (filters?.productionSectionIds) {
				this.productionSectionIds = filters.productionSectionIds;
			} else {
				this.productionSectionIds = null;
			}
		});
	}

	protected get getSelectedElemCount(): number {
		return this.rowCheckboxes.value.filter((ctrl) => ctrl).length;
	}

	public isSubColumn(columnId: string): boolean {
		return this.visibleColumns().some(
			(column) =>
				column.subColumns && column.subColumns.includes(columnId)
		);
	}

	public getMasterCheckboxIndeterminate(): boolean {
		return this.tableStateService.isMasterCheckboxIndeterminate();
	}

	public formatColumnName(name: string): string {
		if (name.match(/\d{2}-\d{2}$/)) {
			const [, month, day] = name.split('-');

			return `${day}.${month}`;
		}

		return name;
	}

	public isWmsUpload(columnId: string): boolean {
		return (
			this.days().find((day) => day.day.startsWith(columnId))
				?.isWmsUpload || false
		);
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

	public openCalculationOfRawMaterialsForCheckList(day: string): void {
		const tovIds = this.getSelectedIds();

		const param: UpdateRawMaterialsData = {
			day,
			weekId: this.operationPlanState.weekId$.value!,
			total: tovIds.length,
			tovIds,
		};

		this.operationPlanPopup.openCalculationOfRawMaterials(param);
	}

	public openCalculationOfRawMaterialsForColumn(columnName: string): void {
		const rawFilter: OperationPlanRequest & Pagination =
			this.operationPlanState.filterValueStore$.value!;

		const weekId = this.operationPlanState.weekId$.value!;

		const data = this.days().find((day) =>
			day.day.startsWith(columnName.slice(5))
		)!;

		const param: UpdateRawMaterialsData = {
			day: data.day,
			weekId,
			total: this.totalItems(),
			filterParams: rawFilter,
		};

		this.operationPlanPopup.openCalculationOfRawMaterials(param);
	}

	private getSelectedIds(): number[] {
		return this.data()
			.map((row, idx) => (this.rowCheckboxes.value[idx] ? row.id : null))
			.filter((id): id is number => id !== null);
	}

	protected deleteItemsTov(): void {
		this.operationPlanService
			.deleteItemsTov(this.getSelectedIds())
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	public openOrderAnOutfit(params: OrderAnOutfit): void {
		const form = document.createElement('form');

		form.method = 'POST';
		form.action = params.linkToModule;
		form.target = 'NewWindow';
		form.id = 'ReceipTermsTree';

		// Добавляем все параметры кроме linkToModule
		Object.entries(params).forEach(([key, value]) => {
			if (key === 'linkToModule') {
				return;
			}

			const formInput = document.createElement('input');

			formInput.type = 'hidden';
			formInput.name = key;
			formInput.value =
				value !== undefined && value !== null ? String(value) : '';
			form.appendChild(formInput);
		});

		document.body.appendChild(form);

		const features =
			'resizable=yes,status=no,scroll=no,help=no,center=yes,width=460,height=200,menubar=no,directories=no,location=no,modal=yes';
		const newWindow = window.open('', 'NewWindow', features);

		form.submit();

		if (!newWindow) {
			console.warn('Pop-ups must be enabled to open the new window.');
		}

		document.body.removeChild(form);
	}

	protected popupCloseEmit(): void {
		this.tableStateService.onMasterCheckboxChange(false);
	}

	protected orderAnOutfit(columnId: string): void {
		const data = this.days().find((day) =>
			day.day.startsWith(columnId.slice(5))
		)!;
		const params: OrderAnOutfitRequest = {
			date: data.day!,
		};

		this.operationPlanService.orderAnOutfit(params).subscribe((item) => {
			this.openOrderAnOutfit(item);
		});
	}

	protected orderAnOutfitForCheckList(day: IDay): void {
		const ids = this.getSelectedIds();
		const params: OrderAnOutfitRequest = {
			date: day.day,
			ids,
		};

		this.operationPlanService.orderAnOutfit(params).subscribe((item) => {
			this.openOrderAnOutfit(item);
		});
	}

	protected openApproveMaterials(column: string): void {
		const date = this.days().find((day) =>
			day.day.startsWith(column.slice(5))
		)!.day;
		const data: ApproveMaterialData = {
			total: this.totalItems(),
			dataStart: new Date(date),
		};

		this.operationPlanPopup.openApproveMaterials(data);
	}

	protected uploadWMS(columnId: string): void {
		const data = this.days().find((day) =>
			day.day.startsWith(columnId.slice(5))
		)!;

		this.operationPlanService
			.uploadWMS(data.day)
			.pipe(untilDestroyed(this))
			.subscribe((value) => {
				window.open(value.linkToModule);
			});
	}

	protected onPlanInfoEnter(date: string): void {
		if (this.productionSectionIds) {
			this.operationPlanService
				.getPlanInfo(
					this.operationPlanState.weekId$.value!,
					date.slice(-10),
					this.productionSectionIds
				)
				.subscribe((res) => {
					this.planTooltipText = `Всего по выбранным участкам  — ${
						res.planDayTotalQuantity
					}`;
					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.planTooltipText =
				'Чтобы проверить общее количество готовой продукции, примените фильтр по участку';
		}
	}

	protected readonly Status = Status;
	protected readonly ActionBarItemType = ActionBarItemType;
}
