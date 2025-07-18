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
import { UsersApiService } from '@app/core/api/users-api.service';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';

export interface SearchInputItem {
	id: number | null;
	title: string | null;
}

@UntilDestroy()
@Component({
	selector: 'ss-search-user-input',
	templateUrl: './search-user-input.component.html',
	styleUrls: ['./search-user-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchUserInputComponent), // replace name as appropriate
			multi: true,
		},
	],
	imports: [CommonModule, CaptionComponent, NgIf, AsyncPipe, NgForOf],
	standalone: true,
})
export class SearchUserInputComponent implements ControlValueAccessor {
	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public label: string | undefined;

	@Input()
	disabled = false;

	private readonly entityId$: BehaviorSubject<number | null> =
		new BehaviorSubject<number | null>(null);

	private OnChange!: (value: number) => void;
	private OnTouched!: (value: number | null) => void;

	protected query: string | null | undefined = '';

	public found$: BehaviorSubject<IDictionaryItemDto[]> = new BehaviorSubject<
		IDictionaryItemDto[]
	>([]);

	constructor(
		private readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef,
		private readonly usersApiService: UsersApiService
	) {
		this.entityId$
			.pipe(
				untilDestroyed(this),
				filterTruthy(),
				switchMap((id) => {
					return this.getEntity(id);
				}),
				tap((entity) => {
					if (entity && entity.title && entity.id) {
						this.query = entity.title;
						this.OnChange(entity.id);
					}
				})
			)
			.subscribe(() => ref.detectChanges());
	}

	private getEntity(value: number): Observable<SearchInputItem | null> {
		return this.usersApiService.getUserById(value).pipe(
			map((res) => {
				return { id: res.id, title: res.name };
			})
		);
	}

	setItem(item: IDictionaryItemDto) {
		if (item.id && item.name) {
			this.query = item.name;
			this.found$.next([]);
			this.OnChange(item.id);
		}
	}

	writeValue(value: number) {
		this.entityId$.next(value);
	}

	public registerOnChange(fn: (value: number) => void): void {
		this.OnChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.OnTouched = fn;
	}

	public onInputValueChange(event: Event) {
		const targetDivElement = event.target as HTMLInputElement;

		this.search(targetDivElement.value);
	}

	protected search(query: string) {
		if (query.length > 2) {
			this.searchFacade
				.getUsers(query)
				.pipe(untilDestroyed(this))
				.subscribe((res) => {
					this.found$.next(res.items);
					this.ref.detectChanges();
				});
		}
	}
}
