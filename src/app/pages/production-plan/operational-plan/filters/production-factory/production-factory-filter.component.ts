import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { Observable, map } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderFilterCheckboxItemAbstractComponent } from '@app/pages/production-plan/operational-plan/filters/header-filter-checkbox-item-abstract/header-filter-checkbox-search-item-abstract.component';
import {
	CheckboxComponent,
	DropdownItemComponent,
	InputComponent,
	TextComponent,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
	selector: 'app-production-factory-filter',
	standalone: true,
	styleUrl: 'production-factory-filter.component.scss',
	templateUrl: 'production-factory-filter.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		InputComponent,
		ReactiveFormsModule,
		DropdownItemComponent,
		CheckboxComponent,
		NgFor,
		AsyncPipe,
		TextComponent,
	],
})
export class ProductionFactoryFilterComponent
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
		return this.filterApiService.getProductionFactory(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionFactory('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
