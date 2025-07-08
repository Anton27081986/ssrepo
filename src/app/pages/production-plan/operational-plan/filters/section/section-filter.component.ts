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

	protected treeNode!: Observable<TreeNodeFilter[]>;

	get trueCheckControlMap(): boolean {
		return (
			Object.values(this.currentControlsMap).some(
				(control) => control.value === true,
			) && this.indeterminate()
		);
	}

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
		this.treeNode = this.items$.pipe(
			map((items) => {
				const node: TreeNodeFilter[] = [];
				items.forEach((parent) => {
					if (!parent.parentId) {
						node.push(
							new TreeNodeFilter(
								parent,
								items,
								this.currentControlsMap,
							),
						);
					}
				});
				return node;
			}),
		);
	}

	override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection(query).pipe(
			map((value) => {
				return value.items.flatMap((item) => {
					const mapItems = item.childs.map((child) => {
						child.parentId = item.data.id;
						return child;
					});
					return [item.data, ...mapItems];
				});
			}),
		);
	}

	override searchActive$(ids: number[]): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection('', ids).pipe(
			map((value) => {
				return value.items.flatMap((item) => {
					const mapItems = item.childs.map((child) => {
						child.parentId = item.data.id;
						return child;
					});
					return [item.data, ...mapItems];
				});
			}),
		);
	}

	protected readonly Align = Align;
}
