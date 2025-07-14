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
	PopoverTriggerForDirective,
	SsTableState,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	IDay,
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import {
	BehaviorSubject,
	filter,
	map,
	Observable,
	scan,
	switchMap,
	tap,
	NEVER,
} from 'rxjs';
import { ProductionPlanResponse } from '@app/core/utils/response';
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
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { OperationPlanRootService } from '@app/pages/production-plan/service/operation-plan.root.service';

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
export class OperationalPlanComponent {
	private readonly operationalPlanService: OperationPlanService =
		inject(OperationPlanService);
	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	public limit = 10;

	public offset$ = new BehaviorSubject<number>(0);
	public itemTotal$ = new BehaviorSubject<number>(0);

	protected activeWeek$: BehaviorSubject<IDictionaryItemDto | null> =
		new BehaviorSubject<IDictionaryItemDto | null>(null);

	public total = 0;

	protected items$: Observable<OperationPlanItem[]> = this.offset$.pipe(
		switchMap((offset) => {
			const week = this.activeWeek$.value;

			if (!week) {
				return NEVER;
			}

			return this.headerFilterService.criteria$.pipe(
				switchMap((criteria) => {
					const filterParams = Object.fromEntries(
						Object.entries(criteria).filter(([_, v]) => v !== null),
					);

					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							weekId: week.id,
						},
						queryParamsHandling: 'merge',
					});

					const valueWithPagination = {
						weekId: week.id,
						...filterParams,
						limit: this.limit,
						offset,
					};
					this.operationPlanState.filterValueStore$.next(
						valueWithPagination as OperationPlanRequest &
							Pagination,
					);

					return this.loadItems(
						valueWithPagination as OperationPlanRequest &
							Pagination,
					);
				}),
			);
		}),
		tap((value) => {
			this.total = value.total;
		}),

		map((value) => value.items),

		scan((acc, value) => {
			if (this.offset$.value === 0) {
				return value;
			}

			return [...acc, ...value];
		}),

		tap((value) => this.itemTotal$.next(value.length)),
	);

	private operationPlanRootService: OperationPlanRootService = inject(
		OperationPlanRootService,
	);

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

	protected days$: BehaviorSubject<IDay[]> = new BehaviorSubject<IDay[]>([]);

	protected operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	constructor() {
		this.headerFilterService.init(operationPlanFilter);
		toSignal(
			this.weeks$.pipe(
				tap((weeks) => {
					const weekIdFromQuery =
						this.activatedRoute.snapshot.queryParamMap.get(
							'weekId',
						);

					let activeWeek = weeks.find((week) => week.isCurrent);

					if (weekIdFromQuery) {
						const found = weeks.find(
							(w) => String(w.id) === String(weekIdFromQuery),
						);

						if (found) {
							activeWeek = found;
						}
					}

					this.activeWeek$.next(activeWeek!);
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

		toSignal(
			this.headerFilterService.criteria$.pipe(
				tap(() => {
					this.offset$.next(0);
				}),
			),
		);

		this.operationPlanRootService.event$.subscribe(() => {
			this.offset$.next(0);
		});
	}

	public loadItems(
		request: OperationPlanRequest & Pagination,
	): Observable<ProductionPlanResponse<OperationPlanItem>> {
		return this.operationalPlanService.getProductionPlan(request).pipe(
			tap((value) => {
				this.days$.next(value.days);
			}),
		);
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

	public changeOffset(offset: number): void {
		this.offset$.next(offset);
	}
}
