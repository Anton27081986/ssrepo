import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	Align,
	CheckboxComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	InputComponent,
	SpinnerComponent,
	TextComponent,
} from '@front-library/components';
import { BehaviorSubject, map, Observable, tap, combineLatest } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/header-filter-checkbox-item-abstract.component';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { TreeNodeFilter } from '@app/pages/production-plan/operational-plan/filters/section/tree-node-filter';
import { DropdownFilterGroupItemsComponent } from '@app/pages/production-plan/component-and-service-for-lib/dropdown-filter-group-items/dropdown-filter-group-items.component';
import { DropdownFilterItemComponent } from '@app/pages/production-plan/component-and-service-for-lib/dropdown-filter-item/dropdown-filter-item.component';

@Component({
	selector: 'app-section-filter',
	standalone: true,
	imports: [
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		ReactiveFormsModule,
		NgFor,
		AsyncPipe,
		CheckboxComponent,
		TextComponent,
		NgIf,
		DropdownFilterGroupItemsComponent,
		DropdownFilterItemComponent,
		SpinnerComponent,
	],
	templateUrl: '/section-filter.component.html',
	styleUrl: 'section-filter.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService,
	);

	private parent$: BehaviorSubject<IDictionaryItemDto[]> =
		new BehaviorSubject<IDictionaryItemDto[]>([]);

	private firstRequest: boolean = true;

	protected treeNode!: Observable<TreeNodeFilter[]>;

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
		this.treeNode = combineLatest([this.parent$, this.items$]).pipe(
			map(([parent, items]) => {
				const node: TreeNodeFilter[] = [];
				parent.forEach((parent) => {
					node.push(
						new TreeNodeFilter(
							parent,
							items,
							this.currentControlsMap,
						),
					);
				});
				return node;
			}),
		);
	}

	override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection(query).pipe(
			tap((value) => {
				const newParents = value.items.map((item) => item.data);
				const oldParents = this.parent$.value;

				const allParents = [...oldParents, ...newParents];
				const uniqueParents = allParents.filter(
					(parent, index, self) =>
						index === self.findIndex((p) => p.id === parent.id),
				);

				if (this.firstRequest) {
					this.parent$.next(uniqueParents);
					this.firstRequest = false;
				} else {
					this.parent$.next(newParents);
				}
			}),
			map((value) => {
				return value.items.flatMap((item) => {
					return item.childs.map((child) => {
						child.parentId = item.data.id;
						return child;
					});
				});
			}),
		);
	}

	override searchActive$(ids: number[]): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection('', ids).pipe(
			tap((value) => {
				const parent: IDictionaryItemDto[] = [];
				value.items.map((item) => {
					parent.push(item.data);
				});

				this.parent$.next(parent);
			}),
			map((value) => {
				return value.items.flatMap((item) => {
					return item.childs.map((child) => {
						child.parentId = item.data.id;
						return child;
					});
				});
			}),
		);
	}

	protected readonly Align = Align;
}
