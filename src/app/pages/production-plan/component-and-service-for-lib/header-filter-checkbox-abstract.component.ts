import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	OnInit,
	output,
	Output,
	OutputEmitterRef,
	signal,
	Signal,
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
} from 'rxjs';
import {} from 'rxjs/internal/operators/merge';
import { IFilterCriterionType } from '@app/pages/production-plan/component-and-service-for-lib/filter-items';

@Component({ template: '' })
export abstract class HeaderFilterCheckboxSearchAbstractComponent<T> {
	public field: InputSignal<string> = input.required();
	public valueEmit: OutputEmitterRef<IFilterCriterionType> = output();

	subscribers: Subscription[] = [];
	public queryControl: FormControl<string | null> = new FormControl<
		string | null
	>(null);

	public isLoader: WritableSignal<boolean> = signal(false);

	protected items$: Observable<T[]> = merge(
		of(null),
		this.queryControl.valueChanges,
	).pipe(
		tap((value) => this.isLoader.set(true)),
		debounceTime(1000),
		switchMap((value) => {
			return this.search$(value);
		}),
		tap((value) => this.isLoader.set(false)),
		shareReplay({
			bufferSize: 1,
			refCount: true,
		}),
	);

	abstract search$(query: string | null): Observable<T[]>;

	abstract getList$(query: string): Observable<T[]>;

	abstract searchActive$(ids: number[]): Observable<T[]>;
}
