import {
	Component,
	inject,
	model,
	ModelSignal,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	FilterCheckboxItem,
	HeaderFilterCheckboxSearchAbstractComponent,
} from '../header-filter-checkbox-abstract/header-filter-checkbox-abstract.component';
import {
	HeaderFilterService,
	IFilterCriterionType,
	IId,
} from '@front-library/components';

@Component({
	template: ``,
	imports: [],
})
export abstract class HeaderFilterCheckboxItemAbstractComponent<T extends IId>
	extends HeaderFilterCheckboxSearchAbstractComponent<T>
	implements OnInit, OnDestroy
{
	protected readonly selectedItems$: BehaviorSubject<
		Array<FilterCheckboxItem<T>>
	> = new BehaviorSubject<Array<FilterCheckboxItem<T>>>([]);

	protected unSelectedItems$: BehaviorSubject<Array<FilterCheckboxItem<T>>> =
		new BehaviorSubject<Array<FilterCheckboxItem<T>>>([]);

	protected viewSelectedItems$: BehaviorSubject<
		Array<FilterCheckboxItem<T>>
	> = new BehaviorSubject<Array<FilterCheckboxItem<T>>>([]);

	protected readonly headerFilterService = inject(HeaderFilterService);

	public readonly controlsClearAll: FormControl<boolean | null> =
		new FormControl<boolean | null>(null);

	public indeterminate: ModelSignal<boolean> = model(false);

	protected constructor() {
		super();

		toSignal(
			this.items$.pipe(
				tap((items) => {
					this.unSelectedItems$.next(items);

					const query = this.queryControl.value;
					this.searchSelectedItem(query);
				})
			)
		);

		toSignal(
			this.controlsClearAll.valueChanges.pipe(
				tap(() => {
					this.indeterminate.set(false);
				})
			)
		);
	}

	// Фильтруем выбранные элементы по поисковому запросу
	public searchSelectedItem(query: string | null): void {
		const selectedItems = this.selectedItems$.value;

		if (query?.trim()) {
			const filteredSelected = selectedItems.filter((item) => {
				const searchQuery = query.toLowerCase().trim();

				// Поиск только по свойству name
				if ('name' in item.item && typeof item.item.name === 'string') {
					return item.item.name.toLowerCase().includes(searchQuery);
				}
				return false;
			});
			this.viewSelectedItems$.next(filteredSelected);
		} else {
			this.viewSelectedItems$.next(selectedItems);
		}
	}

	// Добавление элементы в список выбранных
	public selectedItem(target: FilterCheckboxItem<T>): void {
		target.control.setValue(true);

		const oldValue = this.selectedItems$.value;

		this.selectedItems$.next([...oldValue, target]);
		//	this.viewSelectedItems$.next([...oldValue, target]);
		this.searchSelectedItem(this.queryControl.value!);
		// Удаляем элемент из unSelectedItems
		const currentUnSelected = this.unSelectedItems$.value;
		const filteredUnSelected = currentUnSelected.filter(
			(item) => item.id !== target.id
		);

		this.unSelectedItems$.next(filteredUnSelected);
	}

	// Удаление элемента из списка выбранных
	public unSelectedItem(target: FilterCheckboxItem<T>): void {
		target.control.setValue(false);

		const newArr = this.selectedItems$.value.filter(
			(item) => target.id !== item.id
		);

		this.selectedItems$.next(newArr);
		//	this.viewSelectedItems$.next(newArr);
		this.searchSelectedItem(this.queryControl.value!);
		// Добавляем элемент обратно в unSelectedItems
		const currentUnSelected = this.unSelectedItems$.value;

		const isAlreadyInUnSelected = currentUnSelected.some(
			(item) => item.id === target.id
		);

		if (!isAlreadyInUnSelected) {
			this.unSelectedItems$.next([target, ...currentUnSelected]);
		}
	}

	private calcIndeterminate(): void {
		const trueCount = 0;

		if (trueCount === 0) {
			this.indeterminate.set(false);
			this.controlsClearAll.setValue(false, { emitEvent: false });

			return;
		}

		this.indeterminate.set(true);
		this.controlsClearAll.setValue(false, { emitEvent: false });
	}

	public search$(searchTerm: string | null): Observable<T[]> {
		return this.getList$(searchTerm ?? '');
	}

	public ngOnInit(): void {
		this.selectedItems$
			.pipe(
				map((items) => {
					return items.map((item) => item.id);
				}),
				tap((value) =>
					this.headerFilterService.setValueItemFilter(
						value,
						this.field()
					)
				)
			)
			.subscribe();
	}

	private initSelectedIds(value: IFilterCriterionType): number[] {
		if (Array.isArray(value)) {
			return value;
		}

		return [];
	}

	public ngOnDestroy(): void {
		this.subscribers.forEach((sub) => sub.unsubscribe());
	}
}
