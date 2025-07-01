import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconComponent,
	IconType,
	IDictionaryItemDto,
	LoadPaginationComponent,
	PopoverTriggerForDirective,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { BaseAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/base-abstract-component';
import {
	OperationPlanItems,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { DaysTotal, IResponse } from '@app/core/utils/response';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { operationPlanFilter } from '@app/pages/production-plan/operational-plan/operation-plan.filters';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { IconPosition } from '@front-components/components';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { OperationPlanTableComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table.component';

@Component({
	selector: 'app-plan-days',
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
		OperationPlanTableComponent,
	],
	templateUrl: './operational-plan.component.html',
	styleUrl: './operational-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HeaderFilterService],
})
export class OperationalPlanComponent
	extends BaseAbstractComponent<OperationPlanItems, OperationPlanRequest>
	implements OnInit
{
	private operationalPlanService: OperationPlanService =
		inject(OperationPlanService);

	protected weeks$: Observable<IDictionaryItemDto[]> =
		this.operationalPlanService.getWeeks();

	protected daysTotal$: BehaviorSubject<DaysTotal[]> = new BehaviorSubject<
		DaysTotal[]
	>([]);

	protected activeWeek$: BehaviorSubject<IDictionaryItemDto | null> =
		new BehaviorSubject<IDictionaryItemDto | null>(null);

	private popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	constructor() {
		super();
		this.limit = 7;
		toSignal(
			this.weeks$.pipe(
				tap((value) => {
					this.activeWeek$.next(value[0]);
				}),
			),
		);
	}

	public loadItems(
		request: OperationPlanRequest & Pagination,
	): Observable<IResponse<OperationPlanItems>> {
		return this.activeWeek$.pipe(
			switchMap((week) => {
				// request.weekId = week!.id; // временно
				request.weekId = 202526;
				return this.operationalPlanService.getProductionPlan(request);
			}),
			tap((value) => {
				this.daysTotal$.next(value.daysTotal!);
			}),
		);
	}

	protected openPostponePlanModal(id: number) {
		this.popupService.openPostponePlanModal(id);
	}

	override ngOnInit() {
		this.filtersConfig = operationPlanFilter;
		super.ngOnInit();
	}

	protected selectWeek(week: IDictionaryItemDto) {
		this.activeWeek$.next(week);
	}

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
}
