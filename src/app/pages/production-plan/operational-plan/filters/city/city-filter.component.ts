import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
	CheckboxComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	InputComponent,
	TextComponent,
} from '@front-library/components';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/header-filter-checkbox-item-abstract.component';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ReactiveFormsModule } from '@angular/forms';
import { checkboxFilterContextComponent } from '@app/pages/production-plan/component-and-service-for-lib/checkbox-filter-context/checkbox-filter-context.component';

@Component({
	selector: 'app-city-filter',
	standalone: true,
	imports: [
		AsyncPipe,
		CheckboxComponent,
		FieldCtrlDirective,
		FormFieldComponent,
		TextComponent,
		ReactiveFormsModule,
		InputComponent,
		NgFor,
		NgIf,
		checkboxFilterContextComponent,
	],
	template: ` <ss-lib-checkbox-filter-context
		[queryControl]="queryControl"
		[controlCheckAll]="controlsCheckAll"
		[items]="(items$ | async)!"
		[isLoader]="isLoader()"
		[controlsMap]="currentControlsMap"
		[(indeterminate)]="indeterminate"
	></ss-lib-checkbox-filter-context>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService,
	);

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
	}

	override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getCities(query).pipe(
			map((value) => {
				return value.items;
			}),
		);
	}

	override searchActive$(ids: number[]): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getCities('', ids).pipe(
			map((value) => {
				return value.items;
			}),
		);
	}
}
