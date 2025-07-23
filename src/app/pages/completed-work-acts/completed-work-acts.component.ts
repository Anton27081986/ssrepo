import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { TableComponent } from '@app/shared/components/table/table.component';
import { FiltersComponent } from '@app/shared/components/filters/filters.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { CommonModule, NgIf } from '@angular/common';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { EmptyDataPageComponent } from '@app/shared/components/empty-data-page/empty-data-page.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { OperationPlanEmptyStateComponent } from '@app/pages/production-plan/operational-plan/operation-plan-empty-state/operation-plan-empty-state.component';
import { OperationPlanTableComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table.component';
import {
	ButtonComponent,
	ButtonType, Colors,
	DatepickerComponent,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	HeaderFilterService,
	IconComponent,
	IconPosition,
	IconType,
	LoadPaginationComponent,
	SsTableState,
	TextComponent,
	TextType,
	TextWeight, ToggleComponent,
	TooltipDirective,
} from '@front-library/components';
import { DropdownColumnsSettingsComponent } from '@app/pages/production-plan/operational-plan/dropdown-column-settings/dropdown-columns-settings.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { BehaviorSubject, map, Observable, scan, switchMap, tap } from 'rxjs';
import { Pagination } from '@app/core/models/production-plan/operation-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { CompletedWorkActsTableComponent } from '@app/pages/completed-work-acts/completed-work-acts-table/completed-work-acts-table.component';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { completedWorkActsFilter } from '@app/pages/completed-work-acts/filters/completed-work-acts.filters';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'ss-completed-work-acts',
	templateUrl: './completed-work-acts.component.html',
	styleUrls: ['./completed-work-acts.component.scss'],
	imports: [
		CommonModule,
		HeadlineComponent,
		ButtonComponent,
		TooltipDirective,
		DropdownButtonComponent,
		FiltersComponent,
		NgIf,
		TableComponent,
		MapperPipe,
		PaginationComponent,
		EmptyDataPageComponent,
		LoaderComponent,
		FiltersTableCanvasComponent,
		OperationPlanEmptyStateComponent,
		OperationPlanTableComponent,
		ButtonComponent,
		DropdownItemComponent,
		DropdownListComponent,
		IconComponent,
		LoadPaginationComponent,
		DropdownColumnsSettingsComponent,
		FiltersTriggerButtonComponent,
		ButtonComponent,
		CompletedWorkActsTableComponent,
		TextComponent,
		TooltipDirective,
		DatepickerComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		ReactiveFormsModule,
		ToggleComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [HeaderFilterService, SsTableState],
})
export class CompletedWorkActsComponent {
	public calendarControl = new FormControl();
	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	private readonly completedWorkActsFacade: CompletedWorkActsFacadeService =
		inject(CompletedWorkActsFacadeService);

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	public limit = 10;

	public offset$ = new BehaviorSubject<number>(0);
	public itemTotal$ = new BehaviorSubject<number>(0);

	public total = 0;

	protected items$: Observable<ICompletedWorkAct[]> = this.offset$.pipe(
		switchMap((offset) => {
			return this.headerFilterService.criteria$.pipe(
				switchMap((criteria) => {
					const filterParams = Object.fromEntries(
						Object.entries(criteria).filter(([_, v]) => v !== null)
					);

					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: this.activatedRoute.snapshot.queryParams,
						queryParamsHandling: 'merge',
					});

					const valueWithPagination = {
						...filterParams,
						limit: this.limit,
						offset,
					};

					this.completedWorkActsFacade.filterValueStore$.next(
						valueWithPagination as ICompletedActsFilter & Pagination
					);

					return this.completedWorkActsFacade.getWorkActsList(
						valueWithPagination as ICompletedActsFilter & Pagination
					);
				})
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

		tap((value) => this.itemTotal$.next(value.length))
	);

	public permissions: Signal<string[]> = toSignal(
		this.completedWorkActsFacade.permissions$,
		{
			initialValue: [],
		}
	);

	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
	protected readonly FormControl = FormControl;
	constructor() {
		this.headerFilterService.init(completedWorkActsFilter);

		toSignal(
			this.headerFilterService.criteria$.pipe(
				tap(() => {
					this.offset$.next(0);
				})
			)
		);
	}

	public downloadInstruction() {
		const link = document.createElement('a');

		link.href = this.completedWorkActsFacade.linkToInstruction;
		link.click();
	}

	protected readonly Colors = Colors;
}
