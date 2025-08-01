import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import {
	Align,
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	HintComponent,
	HintType,
	IconComponent,
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
	IndicatorChecklistPopupComponent,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { generateColumnOperationPlanConfig } from '@app/pages/production-plan/operational-plan/operation-plan-table/generate-column-oper-plan-config';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, debounceTime, switchMap } from 'rxjs';
import { Subject, Observable, of } from 'rxjs';
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
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-operation-plan-table',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		NgFor,
		IconComponent,
		TableDirective,
		TableThGroupComponent,
		ThComponent,
		CheckboxComponent,
		ReactiveFormsModule,
		TextComponent,
		TableHeadDirective,
		DatePipe,
		OperationPlanTableTbodyComponent,
		HintComponent,
		UtilityButtonComponent,
		NgIf,
		TooltipDirective,
		IndicatorChecklistPopupComponent,
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

	// Inputs
	public planItems = input.required<OperationPlanItem[]>();
	public days = input.required<IDay[]>();
	public total = input.required<number>();
	public totalItems = input.required<number>();

	// Signals
	private readonly planInfoSubject = new Subject<string>();
	private readonly planTooltipTextSignal = signal<string>(
		'Чтобы проверить общее количество готовой продукции, примените фильтр по участку'
	);

	private readonly productionSectionIdsSignal = signal<number[] | null>(null);
	private readonly popupVisibleSignal = signal<boolean>(false);

	// Computed values
	public readonly planTooltipText = this.planTooltipTextSignal.asReadonly();
	public readonly productionSectionIds =
		this.productionSectionIdsSignal.asReadonly();

	public readonly popupVisible = this.popupVisibleSignal.asReadonly();

	// Table state
	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly data = this.tableStateService.data;
	public readonly visibleColumns = this.tableStateService.visibleColumns;
	public readonly masterCheckboxCtrl =
		this.tableStateService.getMasterCheckboxCtrl();

	public readonly rowCheckboxes = this.tableStateService.getRowCheckboxes();

	// Computed selected count
	public readonly selectedCount = toSignal(
		this.rowCheckboxes.valueChanges.pipe(
			map((value) => value.filter((ctrl) => ctrl).length)
		),
		{ initialValue: 0 }
	);

	// Computed master checkbox state
	public readonly isMasterCheckboxIndeterminate = computed(() =>
		this.tableStateService.isMasterCheckboxIndeterminate()
	);

	// Computed selected IDs
	public readonly selectedIds = toSignal(
		this.rowCheckboxes.valueChanges.pipe(
			map((value) =>
				this.data()
					.map((row, idx) => (value[idx] ? row.id : null))
					.filter((id): id is number => id !== null)
			)
		),
		{ initialValue: [] as number[] }
	);

	// Constants
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Align = Align;
	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly HintType = HintType;
	protected readonly TooltipPosition = TooltipPosition;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		this.initializeCheckboxHandlers();
		this.initializeTableConfig();
		this.initializeFilterSubscription();
		this.initializeTooltipDebouncing();
	}

	// Public methods
	public isSubColumn(columnId: string): boolean {
		return this.visibleColumns().some((column) =>
			column.subColumns?.includes(columnId)
		);
	}

	public formatColumnName(name: string): string {
		// Проверяем, является ли name датой в формате MM-DD
		const dateMatch = name.match(/^(\d{2})-(\d{2})$/);

		if (dateMatch) {
			return `${dateMatch[1]}.${dateMatch[2]}`;
		}

		// Проверяем, есть ли дата в конце строки (старый формат)
		const endMatch = name.match(/\d{2}-\d{2}$/);

		if (endMatch) {
			const [, month, day] = name.split('-');

			return `${month}.${day}`;
		}

		return name;
	}

	public isWmsUpload(columnId: string): boolean {
		return (
			this.days().find((day) => day.day.startsWith(columnId))
				?.isWmsUpload ?? false
		);
	}

	public getSubColumnName(subColumnId: string): string {
		if (subColumnId.startsWith('planQuantity-')) {
			const date = subColumnId.slice(12); // Убираем 'planQuantity-' (12 символов)
			const match = date.match(/^(\d{2})-(\d{2})$/);

			return match ? `${match[1]}.${match[2]}` : 'План';
		}

		if (subColumnId.startsWith('factQuantity-')) {
			const date = subColumnId.slice(12); // Убираем 'factQuantity-' (12 символов)
			const match = date.match(/^(\d{2})-(\d{2})$/);

			return match ? `${match[1]}.${match[2]}` : 'Факт';
		}

		return subColumnId;
	}

	public openCalculationOfRawMaterialsForCheckList(day: string): void {
		const param: UpdateRawMaterialsData = {
			day,
			weekId: this.operationPlanState.weekId$.value!,
			total: this.selectedIds().length,
			tovIds: this.selectedIds(),
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

	protected deleteItemsTov(): void {
		this.operationPlanService
			.deleteItemsTov(this.selectedIds())
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	public openOrderAnOutfit(params: OrderAnOutfit): void {
		const form = document.createElement('form');

		form.method = 'POST';
		form.action = params.linkToModule;
		form.target = 'NewWindow';
		form.id = 'ReceipTermsTree';

		Object.entries(params).forEach(([key, value]) => {
			if (key === 'linkToModule') {
				return;
			}

			const formInput = document.createElement('input');

			formInput.type = 'hidden';
			formInput.name = key;
			formInput.value = value?.toString() ?? '';
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
		this.popupVisibleSignal.set(false);
		this.tableStateService.onMasterCheckboxChange(false);
	}

	protected orderAnOutfit(columnId: string): void {
		const data = this.days().find((day) =>
			day.day.startsWith(columnId.slice(5))
		)!;
		const params: OrderAnOutfitRequest = { date: data.day! };

		this.operationPlanService.orderAnOutfit(params).subscribe((item) => {
			this.openOrderAnOutfit(item);
		});
	}

	protected orderAnOutfitForCheckList(day: IDay): void {
		const params: OrderAnOutfitRequest = {
			date: day.day,
			ids: this.selectedIds(),
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
		this.planInfoSubject.next(date);
	}

	// Private methods
	private initializeCheckboxHandlers(): void {
		toSignal(
			this.masterCheckboxCtrl.valueChanges.pipe(
				tap((value) =>
					this.tableStateService.onMasterCheckboxChange(value)
				)
			)
		);

		toSignal(
			this.rowCheckboxes.valueChanges.pipe(
				tap((value) => {
					const count = value.filter((ctrl) => ctrl).length;

					if (count > 0 && !this.popupVisibleSignal()) {
						this.popupVisibleSignal.set(true);
					} else if (count === 0) {
						this.popupVisibleSignal.set(false);
					}

					this.tableStateService.updateMasterCheckboxState();
				})
			)
		);
	}

	private initializeTableConfig(): void {
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
	}

	private initializeFilterSubscription(): void {
		this.operationPlanState.filterValueStore$.subscribe((filters) => {
			this.productionSectionIdsSignal.set(
				filters?.productionSectionIds ?? null
			);
		});
	}

	private initializeTooltipDebouncing(): void {
		this.planInfoSubject
			.pipe(
				debounceTime(300),
				switchMap((date) => this.loadPlanInfo(date)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	private loadPlanInfo(date: string): Observable<void> {
		if (!this.productionSectionIds()) {
			this.planTooltipTextSignal.set(
				'Чтобы проверить общее количество готовой продукции, примените фильтр по участку'
			);

			return of(undefined);
		}

		return this.operationPlanService
			.getPlanInfo(
				this.operationPlanState.weekId$.value!,
				date.slice(-10),
				this.productionSectionIds()!
			)
			.pipe(
				tap((res) => {
					this.planTooltipTextSignal.set(
						`Всего по выбранным участкам  — ${res.planDayTotalQuantity}`
					);
					this.changeDetectorRef.detectChanges();
				}),
				switchMap(() => of(undefined))
			);
	}
}
