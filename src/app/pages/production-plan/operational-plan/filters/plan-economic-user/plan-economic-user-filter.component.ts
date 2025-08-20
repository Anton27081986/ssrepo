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
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/operational-plan/filters/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';

@Component({
	selector: 'app-plan-economic-user-filter',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		CheckboxComponent,
		FormFieldComponent,
		InputComponent,
		FieldCtrlDirective,
		ScrollbarComponent,
		DropdownItemComponent,
		TextComponent,
		DividerComponent,
		NgIf,
		NgFor,
	],
	templateUrl: 'plan-economic-user-filter.component.html',
	styleUrls: ['plan-economic-user-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEconomicUserFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getPlanEconomicUser(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getPlanEconomicUser('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
