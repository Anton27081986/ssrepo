import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	Align,
	FieldCtrlDirective,
	FormFieldComponent,
	HeaderFilterCheckboxItemAbstractComponent,
	InputComponent,
	SpinnerComponent,
	TextComponent,
} from '@front-library/components';
import { map, Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { TreeNode } from '@app/pages/production-plan/operational-plan/filters/section/tree-node';
import { FilterSectionParentItems } from '@app/core/models/production-plan/filter-section-dto';

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
	],
	templateUrl: '/section-filter.component.html',
	styleUrl: 'section-filter.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected treeNode$!: Observable<TreeNode[]>;

	protected node: IDictionaryItemDto[] = [];

	protected readonly Align = Align;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public get trueCheckControlMap(): boolean {
		return (
			Object.values(this.currentControlsMap).some(
				(control) => control.value === true
			) && this.indeterminate()
		);
	}

	public override ngOnInit(): void {
		super.ngOnInit();
		this.treeNode$ = this.items$.pipe(
			map((items) => {
				const node: TreeNode[] = [];

				items.forEach((parent) => {
					if (!parent.parentId) {
						node.push(
							new TreeNode(parent, items, this.currentControlsMap)
						);
					}
				});

				return node;
			})
		);
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection(query).pipe(
			map((value) => {
				const flat: IDictionaryItemDto[] = [];

				value.parentItems.forEach(
					(parent: FilterSectionParentItems) => {
						// Добавляем родителя (date)
						flat.push(parent.data);
						// Добавляем детей с parentId = parent.date.id
						parent.childs.forEach((child: IDictionaryItemDto) => {
							flat.push({
								...child,
								parentId: parent.data.id,
							});
						});
					}
				);
				this.node = value.items;

				return [...flat, ...value.items];
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionSection('', ids).pipe(
			map((value) => {
				const flat: IDictionaryItemDto[] = [];

				value.parentItems.forEach(
					(parent: FilterSectionParentItems) => {
						flat.push(parent.data);
						parent.childs.forEach((child: IDictionaryItemDto) => {
							flat.push({
								...child,
								parentId: parent.data.id,
							});
						});
					}
				);
				this.node = value.items;

				return [...flat, ...value.items];
			})
		);
	}
}
