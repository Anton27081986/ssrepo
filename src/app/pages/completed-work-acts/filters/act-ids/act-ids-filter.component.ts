import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	Align,
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
import { CompletedWorkActsFiltersApiService } from '@app/pages/completed-work-acts/services/completed-work-acts-filters-api.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/shared/components/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';

@Component({
	selector: 'app-act-ids-filter',
	standalone: true,
	styleUrl: 'act-ids-filter.component.scss',
	templateUrl: 'act-ids-filter.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		CheckboxComponent,
		FormFieldComponent,
		InputComponent,
		FieldCtrlDirective,
		ScrollbarComponent,
		DropdownItemComponent,
		DividerComponent,
		TextComponent,
		ReactiveFormsModule,
		NgIf,
		NgFor,
	],
})
export class ActIdsFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: CompletedWorkActsFiltersApiService =
		inject(CompletedWorkActsFiltersApiService);

	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getIds(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getIds('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	protected readonly Align = Align;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
}
