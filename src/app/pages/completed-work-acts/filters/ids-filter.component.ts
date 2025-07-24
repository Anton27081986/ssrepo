import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { HeaderFilterCheckboxItemAbstractComponent } from '@front-library/components';
import { CheckboxFilterContextComponent } from '@app/pages/production-plan/component-and-service-for-lib/checkbox-filter-context/checkbox-filter-context.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompletedWorkActsFiltersApiService } from '@app/pages/completed-work-acts/services/completed-work-acts-filters-api.service';

@Component({
	selector: 'app-act-ids-filter',
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
export class ActIdsFilterComponent
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
		if (Number.isNaN(parseInt(query, 10))) {
			return of([]);
		}

		const idsArray = [...new Array(10).keys()].map((value) => {
			return {
				id: parseInt(query + value, 10),
				name: query + value,
			} as IDictionaryItemDto;
		});

		idsArray.unshift({
			id: parseInt(query, 10),
			name: query,
		});

		return of(idsArray);
	}

	public override searchActive$(
		ids: number[]
	): Observable<IDictionaryItemDto[]> {
		return of(
			ids.map((value) => {
				return {
					id: value,
					name: value.toString(10),
				} as IDictionaryItemDto;
			})
		);
	}
}
