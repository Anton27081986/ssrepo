import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	InputSignal,
	OnInit,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	Align,
	CheckboxComponent,
	Colors,
	DropdownItemComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	HeaderFilterService,
	IconComponent,
	IconType,
	InputComponent,
	ScrollbarComponent,
	SpinnerComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import {
	map,
	NEVER,
	Observable,
	of,
	shareReplay,
	switchMap,
	merge,
	tap,
	BehaviorSubject,
	Subscription,
	take,
	combineLatest,
} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { TreeNode } from '@app/pages/production-plan/operational-plan/filters/section/tree-node';
import { FilterSectionDto } from '@app/core/models/production-plan/filter-section-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SectionFilterState } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.state';

@UntilDestroy()
@Component({
	selector: 'app-section-filter',
	standalone: true,
	imports: [
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		ReactiveFormsModule,
		AsyncPipe,
		TextComponent,
		NgIf,
		SpinnerComponent,
		DropdownItemComponent,
		CheckboxComponent,
		NgFor,
		ScrollbarComponent,
		IconComponent,
	],
	templateUrl: '/section-filter.component.html',
	styleUrl: 'section-filter.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [SectionFilterState],
})
export class SectionFilterComponent implements OnInit {
	public field: InputSignal<string> = input.required();

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	protected readonly selectedIds$ = new BehaviorSubject<number[]>([]);

	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	public controlsMap: {
		[id: string]: FormControl<boolean | null>;
	} = {};

	protected readonly queryControl: FormControl<null | string> =
		new FormControl(null);

	protected subscription: Subscription = new Subscription();

	protected sections$: Observable<FilterSectionDto>;

	protected treeNode$: Observable<TreeNode[]>;

	protected node$: Observable<IDictionaryItemDto[]>;

	protected readonly Align = Align;

	constructor() {
		this.sections$ = merge(of(''), this.queryControl.valueChanges).pipe(
			switchMap((value) => {
				if (value === null) {
					return NEVER;
				}

				return this.getList$(value);
			}),
			tap((value) => {
				this.resolveControls(value);
			}),
			shareReplay({
				bufferSize: 1,
				refCount: true,
			})
		);

		this.treeNode$ = this.sections$.pipe(
			map((value) => {
				return value.parentItems.map((item) => {
					const controls: {
						[id: string]: FormControl<boolean | null>;
					} = {};

					item.childs.forEach((item) => {
						controls[item.id] = this.controlsMap[item.id];
					});

					return new TreeNode(item.data, item.childs, controls);
				});
			})
		);

		this.node$ = this.sections$.pipe(
			map((value) => {
				return value.items;
			})
		);

		combineLatest([this.selectedIds$, this.sections$])
			.pipe(take(1))
			.subscribe(([ids, sections]) => {
				if (ids.length) {
					ids.forEach((id) => {
						let control = this.controlsMap[id];

						if (control) {
							const checked =
								this.selectedIds$.value.includes(id);

							control.setValue(checked);
						}
					});
				}
			});
	}

	public ngOnInit(): void {
		const filter = this.headerFilterService.getFilter(this.field());
		this.selectedIds$.next(filter.value ?? []);

		this.selectedIds$.value.forEach((id) => {});

		this.selectedIds$
			.pipe(
				tap((value) => {
					this.headerFilterService.setValueItemFilter(
						value,
						this.field()
					);
				})
			)
			.subscribe();
	}

	protected resolveControls(value: FilterSectionDto) {
		for (const item of value.items) {
			const id = item.id.toString();

			this.controlsMap[id] = this.resolveControl(item.id);
		}

		for (const item of value.parentItems) {
			item.childs.forEach((val) => {
				const id = val.id.toString();

				this.controlsMap[id] = this.resolveControl(val.id);
			});
		}
	}

	protected resolveControl(id: number): FormControl<boolean | null> {
		let control = this.controlsMap[id];
		if (!control) {
			control = new FormControl<boolean | null>(false);

			control.valueChanges.pipe(untilDestroyed(this)).subscribe((val) => {
				const currentIds = [...this.selectedIds$.value];

				if (val) {
					if (!currentIds.includes(Number(id))) {
						this.selectedIds$.next([id, ...currentIds]);
					}
				} else {
					const index = currentIds.indexOf(id);

					if (index !== -1) {
						currentIds.splice(index, 1);
						this.selectedIds$.next(currentIds);
					}
				}
			});

			this.controlsMap[id] = control;
		}

		return control;
	}

	public getList$(query: string): Observable<FilterSectionDto> {
		return this.filterApiService.getProductionSection(query, [], false);
	}

	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
}
