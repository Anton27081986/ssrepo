import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { Observable, map } from 'rxjs';
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
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/shared/components/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-act-costs-filter',
	standalone: true,
	styleUrl: 'costs-filter.component.scss',
	templateUrl: `costs-filter.component.html`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
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
		ReactiveFormsModule,
	],
})
export class ActCostsFilterComponent
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
		return this.filterApiService.getCostArticles(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getCostArticles('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly Align = Align;
}
