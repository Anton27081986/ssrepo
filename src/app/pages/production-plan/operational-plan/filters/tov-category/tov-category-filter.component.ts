import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { HeaderFilterCheckboxItemAbstractComponent } from '@front-library/components';
import { Observable, map } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { CheckboxFilterContextComponent } from '@app/pages/production-plan/blunt-components/checkbox-filter-context/checkbox-filter-context.component';

@Component({
	selector: 'app-tov-category-filter',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		CheckboxFilterContextComponent,
	],
	template: ` <ss-lib-checkbox-filter-context
		[queryControl]="queryControl"
		[controlClearAll]="controlsClearAll"
		[items]="(items$ | async)!"
		[isLoader]="isLoader()"
		[controlsMap]="currentControlsMap"
		[(indeterminate)]="indeterminate"
	></ss-lib-checkbox-filter-context>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TovCategoryFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getTovCategory(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getTovCategory('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
