import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { HeaderFilterCheckboxItemAbstractComponent } from '@front-library/components';
import { CheckboxFilterContextComponent } from '@app/pages/production-plan/component-and-service-for-lib/checkbox-filter-context/checkbox-filter-context.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompletedWorkActsFiltersApiService } from '@app/pages/completed-work-acts/services/completed-work-acts-filters-api.service';

@Component({
	selector: 'app-act-buunits-filter',
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
export class ActBuUnitsFilterComponent
	extends HeaderFilterCheckboxItemAbstractComponent<IDictionaryItemDto>
	implements OnInit
{
	private readonly filterApiService: CompletedWorkActsFiltersApiService =
		inject(CompletedWorkActsFiltersApiService);

	protected readonly itemsSignal: Signal<IDictionaryItemDto[]> = toSignal(
		this.items$,
		{ initialValue: [] }
	);

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		super();
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	public override getList$(query: string): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getBuUnits(query).pipe(
			map((value) => {
				return value.items.filter((item) =>
					item.name.toLowerCase().includes(query.toLowerCase())
				);
			})
		);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return this.filterApiService.getBuUnits('', ids).pipe(
			map((value) => {
				return value.items;
			})
		);
	}
}
