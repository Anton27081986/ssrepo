import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HeaderFilterCheckboxItemAbstractComponent } from '@front-library/components';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxFilterContextComponent } from '@app/pages/production-plan/blunt-components/checkbox-filter-context/checkbox-filter-context.component';

@Component({
	selector: 'app-city-filter',
	standalone: true,
	imports: [AsyncPipe, ReactiveFormsModule, CheckboxFilterContextComponent],
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
}
