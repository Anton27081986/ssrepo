import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { CommonModule, NgIf } from '@angular/common';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DatepickerComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	HeaderFilterService,
	IconPosition,
	IconType,
	InputComponent,
	InputType,
	SsTableState,
	TextComponent,
	TextType,
	TextWeight,
	ToggleComponent,
	TooltipDirective,
} from '@front-library/components';
import { DropdownColumnsSettingsComponent } from '@app/pages/production-plan/operational-plan/dropdown-column-settings/dropdown-columns-settings.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { Pagination } from '@app/core/models/production-plan/operation-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { CompletedWorkActsTableComponent } from '@app/pages/completed-work-acts/completed-work-acts-table/completed-work-acts-table.component';
import { CompletedWorkActsFacadeService } from '@app/pages/completed-work-acts/services/completed-work-acts-facade.service';
import { completedWorkActsFilter } from '@app/pages/completed-work-acts/filters/completed-work-acts.filters';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { Permissions } from '@app/core/constants/permissions.constants';

@Component({
	selector: 'ss-completed-work-acts',
	templateUrl: './completed-work-acts.component.html',
	styleUrls: ['./completed-work-acts.component.scss'],
	imports: [
		CommonModule,
		ButtonComponent,
		TooltipDirective,
		NgIf,
		FiltersTableCanvasComponent,
		ButtonComponent,
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
		PaginationComponent,
		FormsModule,
		InputComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [HeaderFilterService, SsTableState],
})
export class CompletedWorkActsComponent {
	public dateFromControl: FormControl<Date | null> =
		new FormControl<Date | null>(null);

	public dateToControl: FormControl<Date | null> =
		new FormControl<Date | null>(null);

	public uploadDateFromControl: FormControl<Date | null> =
		new FormControl<Date | null>(null);

	public uploadDateToControl: FormControl<Date | null> =
		new FormControl<Date | null>(null);

	public additionalControl = new FormControl();

	public archiveControl = new FormControl();
	public totalAmountControl = new FormControl();

	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	private readonly completedWorkActsFacade: CompletedWorkActsFacadeService =
		inject(CompletedWorkActsFacadeService);

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	public limit = 20;
	public offset$ = new BehaviorSubject<number>(0);
	public itemTotal$ = new BehaviorSubject<number>(0);
	public total = 0;
	public pageIndex = 1;

	protected dateFrom$: BehaviorSubject<string | null> = new BehaviorSubject<
		string | null
	>(null);

	protected items$: Observable<ICompletedWorkAct[]> = this.offset$.pipe(
		switchMap((offset) => {
			const dateFrom = this.dateFromControl.value;
			const dateTo = this.dateToControl.value;
			const uploadDateFrom = this.uploadDateFromControl.value;
			const uploadDateTo = this.uploadDateToControl.value;
			const additional = this.additionalControl.value;
			const archive = this.archiveControl.value;
			const totalAmount = this.totalAmountControl.value;

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
						DateFrom: dateFrom,
						DateTo: dateTo,
						UploadDateFrom: uploadDateFrom,
						UploadDateTo: uploadDateTo,
						Additional: additional ? 1 : 0,
						WithArchive: archive,
						TotalAmount: totalAmount || null,
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
	protected readonly Colors = Colors;
	protected readonly Permissions = Permissions;
	protected readonly InputType = InputType;
	constructor() {
		this.headerFilterService.init(completedWorkActsFilter);

		toSignal(
			this.headerFilterService.criteria$.pipe(
				tap(() => {
					this.offset$.next(0);
				})
			)
		);

		const dateFromFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('DateFrom');

		this.dateFromControl.setValue(
			dateFromFromQuery ? new Date(dateFromFromQuery) : null
		);

		toSignal(
			this.dateFromControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							DateFrom: value ? value.toUTCString() : null,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const dateToFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('DateTo');

		this.dateToControl.setValue(
			dateToFromQuery ? new Date(dateToFromQuery) : null
		);

		toSignal(
			this.dateToControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							DateTo: value
								? value.setDate(value.getDate() + 1)
								: null,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const uploadDateFromFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('UploadDateFrom');

		this.uploadDateFromControl.setValue(
			uploadDateFromFromQuery ? new Date(uploadDateFromFromQuery) : null
		);

		toSignal(
			this.uploadDateFromControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							UploadDateFrom: value ? value.toUTCString() : null,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const uploadDateToFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('UploadDateTo');

		this.uploadDateToControl.setValue(
			uploadDateToFromQuery ? new Date(uploadDateToFromQuery) : null
		);

		toSignal(
			this.uploadDateToControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							UploadDateTo: value
								? value.setDate(value.getDate() + 1)
								: null,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const additionalFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('Additional');

		if (additionalFromQuery === 'true' || additionalFromQuery === null) {
			this.additionalControl.setValue(true);
		}

		if (additionalFromQuery === null) {
			void this.router.navigate([], {
				relativeTo: this.activatedRoute,
				queryParams: {
					...this.activatedRoute.snapshot.queryParams,
					Additional: true,
				},
				queryParamsHandling: 'merge',
			});
			this.offset$.next(0);
		}

		toSignal(
			this.additionalControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							Additional: value,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const totalAmountFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('totalAmount');

		this.totalAmountControl.setValue(totalAmountFromQuery);

		toSignal(
			this.totalAmountControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							TotalAmount: value,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);

		const archiveFromQuery =
			this.activatedRoute.snapshot.queryParamMap.get('WithArchive');

		if (archiveFromQuery === 'true') {
			this.archiveControl.setValue(true);
		}

		toSignal(
			this.archiveControl.valueChanges.pipe(
				tap((value) => {
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams: {
							...this.activatedRoute.snapshot.queryParams,
							WithArchive: value,
						},
						queryParamsHandling: 'merge',
					});
					this.offset$.next(0);
				})
			)
		);
	}

	public downloadInstruction(): void {
		const link = document.createElement('a');

		link.href = this.completedWorkActsFacade.linkToInstruction;
		link.click();
	}

	protected downloadReport(): void {
		this.completedWorkActsFacade
			.downloadReport(
				this.completedWorkActsFacade.filterValueStore$.value
			)
			.subscribe((response) => {
				const downloadLink = document.createElement('a');

				downloadLink.href = URL.createObjectURL(
					new Blob([response], { type: response.type })
				);
				downloadLink.download = `Акты выполненных работ (${new Date(Date.now()).toLocaleString('ru-Ru')}).xlsx`;
				downloadLink.click();
			});
	}

	protected onPage(index: number): void {
		this.pageIndex = index;
		this.offset$.next((index - 1) * this.limit);
	}
}
