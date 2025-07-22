import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import {
	FiltersComponent,
} from '@app/shared/components/filters/filters.component';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import {
	ButtonComponent as OldButtonComponent,
	ButtonType,
	IconPosition,
	IconType,
	Size,
} from '@front-components/components';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
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
	DropdownItemComponent,
	DropdownListComponent,
	HeaderFilterService,
	IconComponent,
	LoadPaginationComponent,
	SsTableState,
	TableDirective,
} from '@front-library/components';
import { DropdownColumnsSettingsComponent } from '@app/pages/production-plan/operational-plan/dropdown-column-settings/dropdown-columns-settings.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import {
	BehaviorSubject,
	map,
	Observable,
	scan,
	switchMap,
	tap,
} from 'rxjs';
import {
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import {
	CompletedWorkActsTableComponent
} from "@app/pages/completed-work-acts/completed-work-acts-table/completed-work-acts-table.component";

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
		TableDirective,
		ButtonComponent,
		DropdownItemComponent,
		DropdownListComponent,
		IconComponent,
		LoadPaginationComponent,
		DropdownColumnsSettingsComponent,
		FiltersTriggerButtonComponent,
		ButtonComponent,
		OldButtonComponent,
		CompletedWorkActsTableComponent,
	],
	standalone: true,
})
export class CompletedWorkActsComponent {
	private readonly tableStateService = inject(SsTableState);

	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly data = this.tableStateService.data;
	public readonly visibleColumns = this.tableStateService.visibleColumns;

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	public limit = 20;

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

	// old

	private readonly filtersKey: string = 'work-acts-filters';

	public permissions: Signal<string[]> = toSignal(
		this.completedWorkActsFacade.permissions$,
		{
			initialValue: [],
		}
	);

	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly localStorageService: LocalStorageService
	) {}

	public openAct(item: { row: ITableItem; icon: string }) {
		if (item.row.code.text) {
			this.completedWorkActsFacade.getAct(item.row.code.text);
		}
	}

	public downloadInstruction() {
		const link = document.createElement('a');

		link.href = this.completedWorkActsFacade.linkToInstruction;
		link.click();
	}
}
