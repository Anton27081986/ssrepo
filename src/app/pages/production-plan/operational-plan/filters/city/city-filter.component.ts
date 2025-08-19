import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
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
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/operational-plan/filters/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';

@Component({
	selector: 'app-city-filter',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormFieldComponent,
		InputComponent,
		FieldCtrlDirective,
		ScrollbarComponent,
		DropdownItemComponent,
		CheckboxComponent,
		TextComponent,
		DividerComponent,
		AsyncPipe,
		NgFor,
		NgIf,
	],
	templateUrl: `city-filter.component.html`,
	styleUrls: ['city-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getCities(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getCities('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly IconType = IconType;
}
