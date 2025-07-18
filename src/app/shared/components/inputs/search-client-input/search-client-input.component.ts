import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { AsyncPipe } from '@angular/common';

export type searchType =
	| 'user'
	| 'subsector'
	| 'tovs'
	| 'region'
	| 'contractor'
	| 'client'
	| 'technologist'
	| undefined;

export interface SearchInputItem {
	id: number | null;
	title: string | null;
}

@UntilDestroy()
@Component({
	selector: 'ss-search-client-input',
	templateUrl: './search-client-input.component.html',
	styleUrls: ['./search-client-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchClientInputComponent), // replace name as appropriate
			multi: true,
		},
	],
	imports: [CaptionComponent, AsyncPipe],
	standalone: true,
})
export class SearchClientInputComponent implements ControlValueAccessor {
	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public label: string | undefined;

	@Input()
	onlyActive = false;

	@Input()
	disabled = false;

	@Output()
	public select = new EventEmitter<SearchInputItem | null>();

	private readonly entityId$: BehaviorSubject<number | null> =
		new BehaviorSubject<number | null>(null);

	protected query: string | null | undefined = '';

	public found$: BehaviorSubject<IDictionaryItemDto[]> = new BehaviorSubject<
		IDictionaryItemDto[]
	>([]);

	constructor(
		private readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef
	) {
		this.entityId$
			.pipe(
				untilDestroyed(this),
				filterTruthy(),
				switchMap((id) => {
					return this.getEntity(id);
				}),
				tap((entity) => {
					if (entity && entity.title) {
						this.query = entity.title;
					} else {
						this.select.emit(null);
					}
				})
			)
			.subscribe(() => ref.detectChanges());
	}

	private getEntity(value: number): Observable<SearchInputItem | null> {
		return this.searchFacade.getClientIdDictionary(value).pipe(
			map((res) => {
				if (res.items.length && res.items[0].id && res.items[0].name) {
					return { id: res.items[0].id, title: res.items[0].name };
				}

				return null;
			})
		);
	}

	setItem(item: IDictionaryItemDto) {
		if (item.id && item.name) {
			this.query = item.name;
			this.found$.next([]);
			this.select.emit({ id: item.id, title: item.name });
		} else {
			this.select.emit({ id: null, title: null });
		}
	}

	writeValue(value: number) {
		this.entityId$.next(value);
	}

	registerOnChange() {}

	registerOnTouched() {}

	public onInputValueChange(event: Event) {
		const targetDivElement = event.target as HTMLInputElement;

		this.search(targetDivElement.value);
	}

	protected search(query: string) {
		if (query.length > 2) {
			this.searchFacade
				.getClients(query, this.onlyActive)
				.pipe(untilDestroyed(this))
				.subscribe((res) => {
					this.found$.next(res.items);
					this.ref.detectChanges();
				});
		}
	}
}
