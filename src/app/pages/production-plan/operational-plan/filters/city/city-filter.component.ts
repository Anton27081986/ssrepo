import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { HeaderFilterCheckboxItemAbstractComponent } from '@front-library/components';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-city-filter',
	standalone: true,
	imports: [ReactiveFormsModule],
	template: ``,
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
