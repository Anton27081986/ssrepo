import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	CheckboxComponent,
	Colors,
	DividerComponent,
	DropdownItemComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	InputComponent,
	ScrollbarComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { map, Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/operational-plan/filters/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';

@Component({
	selector: 'app-tov-filter',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		InputComponent,
		DropdownItemComponent,
		CheckboxComponent,
		TextComponent,
		AsyncPipe,
		NgFor,
		FormFieldComponent,
		FieldCtrlDirective,
		ScrollbarComponent,
		DividerComponent,
		NgIf,
	],
	templateUrl: 'tov-filter.component.html',
	styleUrls: ['tov-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TovFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly ExtraSize = ExtraSize;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService
			.getTov(
				query,
				this.mapIds(),
				this.operationPlanState.weekId$.value!,
				false
			)
			.pipe(
				map((value) => {
					return value.items;
				})
			);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService
			.getTov('', ids, this.operationPlanState.weekId$.value!, true)
			.pipe(
				map((value) => {
					return value.items;
				})
			);
	}

	public mapIds(): number[] {
		return this.viewSelectedItems$.value.map((item) => item.id);
	}
}
