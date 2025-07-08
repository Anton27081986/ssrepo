import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import {
	Align,
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconComponent,
	IconType,
	IDictionaryItemDto,
	PopoverTriggerForDirective,
	SsTableState,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/base-abstract-component';
import {
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import {
	BehaviorSubject,
	filter,
	Observable,
	scan,
	switchMap,
	tap,
} from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { operationPlanFilter } from '@app/pages/production-plan/operational-plan/operation-plan.filters';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { IconPosition } from '@front-components/components';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { OperationPlanTableComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownColumnsSettingsComponent } from '@app/pages/production-plan/operational-plan/dropdown-column-settings/dropdown-columns-settings.component';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { state } from '@angular/animations';
import { OperationPlanEmptyStateComponent } from '@app/pages/production-plan/operational-plan/operation-plan-empty-state/operation-plan-empty-state.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadPaginationComponent } from '@app/pages/production-plan/component-and-service-for-lib/load-pagination/load-pagination.component';

@Component({
	selector: 'app-operation-plan',
	standalone: true,
	imports: [
		ButtonComponent,
		FiltersTableCanvasComponent,
		FiltersTriggerButtonComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		NgFor,
		NgIf,
		AsyncPipe,
		IconComponent,
		OperationPlanTableComponent,
		ReactiveFormsModule,
		DropdownColumnsSettingsComponent,
		OperationPlanEmptyStateComponent,
		LoadPaginationComponent,
	],
	templateUrl: './operational-plan.component.html',
	styleUrl: './operational-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HeaderFilterService, SsTableState],
})
export class OperationalPlanComponent
	extends BaseAbstractComponent<OperationPlanItem, OperationPlanRequest>
	implements OnInit
{
	private readonly operationalPlanService: OperationPlanService =
		inject(OperationPlanService);
	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly Align = Align;
	protected readonly state = state;

	protected weeks$: Observable<IDictionaryItemDto[]> =
		this.operationalPlanService.getWeeks();

	protected days$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
		[],
	);

	protected operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	protected activeWeek$: BehaviorSubject<IDictionaryItemDto | null> =
		new BehaviorSubject<IDictionaryItemDto | null>(null);

	constructor() {
		super();
		this.limit = 7;
		toSignal(
			this.weeks$.pipe(
				tap((weeks) => {
					const weekIdFromQuery =
						this.activatedRoute.snapshot.queryParamMap.get(
							'weekId',
						);

					let activeWeek = weeks[0];

					if (weekIdFromQuery) {
						const found = weeks.find(
							(w) => String(w.id) === String(weekIdFromQuery),
						);

						if (found) {
							activeWeek = found;
						}
					}

					this.activeWeek$.next(activeWeek);
				}),
			),
		);

		toSignal(
			this.activeWeek$.pipe(
				tap((value) => {
					if (value) {
						void this.router.navigate([], {
							relativeTo: this.activatedRoute,
							queryParams: {
								...this.activatedRoute.snapshot.queryParams,
								weekId: value.id,
							},
							queryParamsHandling: 'merge',
						});
						this.operationPlanState.weekId$.next(value.id);
						this.offset$.next(0);
					}
				}),
			),
		);
	}

	public loadItems(
		request: OperationPlanRequest & Pagination,
	): Observable<IResponse<OperationPlanItem>> {
		return this.activeWeek$.pipe(
			filter((value) => value !== null),
			switchMap((week) => {
				request.weekId = week!.id; // временно
				const filterParams = Object.fromEntries(
					Object.entries(request).filter(([_, v]) => v !== null),
				);
				this.operationPlanState.filterValueStore$.next(
					filterParams as OperationPlanRequest & Pagination,
				);

				return this.operationalPlanService.getProductionPlan(
					filterParams as OperationPlanRequest & Pagination,
				);
			}),
			tap((value) => {
				this.days$.next(value.days!);
			}),
		);
	}

	override ngOnInit(): void {
		this.filtersConfig = operationPlanFilter;
		super.ngOnInit();
	}

	protected selectWeek(week: IDictionaryItemDto): void {
		this.activeWeek$.next(week);
	}

	public hasCustomFilters(): boolean {
		const filters = this.operationPlanState.filterValueStore$.value;
		if (!filters) {
			return false;
		}

		if (this.total > 0) {
			return true;
		}

		return Object.keys(filters).some(
			(key) => !['weekId', 'limit', 'offset'].includes(key),
		);
	}
}
