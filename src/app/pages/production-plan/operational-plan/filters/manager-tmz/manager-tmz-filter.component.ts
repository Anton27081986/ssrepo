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
import { map, Observable } from 'rxjs';
import {
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
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/operational-plan/filters/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';

@Component({
	selector: 'app-manager-tmz-filter',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		CheckboxComponent,
		DividerComponent,
		FormFieldComponent,
		InputComponent,
		FieldCtrlDirective,
		ScrollbarComponent,
		DropdownItemComponent,
		NgForOf,
		TextComponent,
		NgIf,
		AvatarComponent,
	],
	templateUrl: 'manager-tmz-filter.component.html',
	styleUrls: ['manager-tmz-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerTmzFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<AvatarDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
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
		return this.filterApiService.getProductManagerUser(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<AvatarDictionaryItemDto[]> {
		return this.filterApiService.getProductManagerUser('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
