import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import { map, Observable } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	FormFieldComponent,
	HeaderFilterCheckboxItemAbstractComponent,
} from '@front-library/components';
import { CheckboxFilterContextComponent } from '@app/pages/production-plan/component-and-service-for-lib/checkbox-filter-context/checkbox-filter-context.component';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-production-factory-filter',
	standalone: true,
	styles: '',
	template: ` <ss-lib-checkbox-filter-context
		[queryControl]="queryControl"
		[controlClearAll]="controlsClearAll"
		[items]="itemsSignal()"
		[isLoader]="isLoader()"
		[controlsMap]="currentControlsMap"
		[(indeterminate)]="indeterminate"
	></ss-lib-checkbox-filter-context>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CheckboxFilterContextComponent],
})
export class ProductionFactoryFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected readonly itemsSignal: Signal<IDictionaryItemDto[]> = toSignal(
		this.items$,
		{ initialValue: [] }
	);

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
	}

	override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionFactory(query).pipe(
			map((value) => {
				return value.items;
			})
		);
	}

	override searchActive$(ids: number[]): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getProductionFactory('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
