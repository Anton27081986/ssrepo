import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import {
	AvatarDictionaryItemDto,
	OperationPlanFiltersApiService,
} from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	Align,
	AvatarComponent,
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
		AvatarComponent,
	],
	templateUrl: 'plan-economic-user-filter.component.html',
	styleUrls: ['plan-economic-user-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEconomicUserFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<AvatarDictionaryItemDto>
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
	protected readonly Align = Align;
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(
		query: string
	): Observable<AvatarDictionaryItemDto[]> {
		return this.filterApiService
			.getPlanEconomicUser(query, this.mapViewSelectedIds(), false)
			.pipe(
				map((value) => {
					return value.items;
				})
			);
	}

	public override searchActive$(
		ids: number[]
	): Observable<AvatarDictionaryItemDto[]> {
		return this.filterApiService.getPlanEconomicUser('', ids, true).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
