import {
	Component,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	signal,
	WritableSignal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	Observable,
	switchMap,
	merge,
	of,
	shareReplay,
	Subscription,
	tap,
	debounceTime,
	map,
} from 'rxjs';
import { IFilterCriterionType, IId } from '@front-library/components';

export interface FilterCheckboxItem<T> {
	id: number;
	control: FormControl<boolean | null>;
	item: T;
}

@Component({ template: '' })
export abstract class HeaderFilterCheckboxSearchAbstractComponent<
	T extends IId,
> {
	public field: InputSignal<string> = input.required();
	public valueEmit: OutputEmitterRef<IFilterCriterionType> = output();

	public subscribers: Subscription[] = [];
	public queryControl: FormControl<string | null> = new FormControl<
		string | null
	>(null);

	public isLoader: WritableSignal<boolean> = signal(false);

	protected items$: Observable<FilterCheckboxItem<T>[]> = merge(
		of(null),
		this.queryControl.valueChanges
	).pipe(
		tap(() => this.isLoader.set(true)),
		debounceTime(500),
		switchMap((value) => {
			return this.search$(value).pipe(
				map((items) => {
					return this.mapFilterItems(items);
				})
			);
		}),
		tap(() => this.isLoader.set(false)),
		shareReplay({
			bufferSize: 1,
			refCount: true,
		})
	);

	public abstract search$(query: string | null): Observable<T[]>;

	public abstract getList$(query: string): Observable<T[]>;

	public abstract searchActive$(ids: number[]): Observable<T[]>;

	public mapFilterItems(items: T[]): FilterCheckboxItem<T>[] {
		return items.map((item) => {
			return {
				id: item.id,
				control: new FormControl(false),
				item: item,
			};
		});
	}
}
