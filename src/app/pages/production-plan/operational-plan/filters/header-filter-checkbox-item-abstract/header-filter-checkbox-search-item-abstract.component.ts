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
import { HeaderFilterService, IId } from '@front-library/components';

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

	public indeterminateText: ModelSignal<string> = model('Очистить все');

	protected constructor() {
		super();

		toSignal(
			this.items$.pipe(
				tap((items) => {
					const selectedIds = new Set(
						this.selectedItems$.value.map((s) => s.id)
					);
					const onlyUnselected = items.filter(
						(item) => !selectedIds.has(item.id)
					);
					this.unSelectedItems$.next(onlyUnselected);

					const query = this.queryControl.value;
					this.searchSelectedItem(query);
				})
			)
		);

		toSignal(
			this.controlsClearAll.valueChanges.pipe(
				tap(() => {
					this.indeterminate.set(false);
					if (this.queryControl.value?.trim()) {
						const view = this.viewSelectedItems$.value;
						if (view.length) {
							// сбрасываем чекбоксы у всех видимых выбранных
							view.forEach((v) => v.control.setValue(false));
							const remaining = this.selectedItems$.value.filter(
								(item) => !view.some((v) => v.id === item.id)
							);
							this.selectedItems$.next(remaining);
							// возвращаем удаленные в unSelectedItems без дублей
							const currentUnselected =
								this.unSelectedItems$.value;
							const merged = [...currentUnselected];
							view.forEach((item) => {
								if (!merged.some((u) => u.id === item.id)) {
									merged.unshift(item);
								}
							});
							this.unSelectedItems$.next(merged);
						}
						this.viewSelectedItems$.next([]);
					} else {
						// сбрасываем чекбоксы у всех выбранных
						this.selectedItems$.value.forEach((s) =>
							s.control.setValue(false)
						);
						// возвращаем все выбранные обратно в unSelectedItems без дублей
						const toReturn = this.selectedItems$.value;
						if (toReturn.length) {
							const currentUnselected =
								this.unSelectedItems$.value;
							const merged = [...currentUnselected];
							toReturn.forEach((item) => {
								if (!merged.some((u) => u.id === item.id)) {
									merged.push(item);
								}
							});
							this.unSelectedItems$.next(merged);
						}
						this.selectedItems$.next([]);
						this.viewSelectedItems$.next([]);
					}
				})
			)
		);

		toSignal(
			this.viewSelectedItems$.pipe(
				tap((item) => {
					item.length
						? this.indeterminate.set(true)
						: this.indeterminate.set(false);
				})
			)
		);

		toSignal(
			this.queryControl.valueChanges.pipe(
				tap((val) => {
					if (val?.trim()) {
						this.indeterminateText.set('Очистить выбранные');
					} else {
						this.indeterminateText.set('Очистить все');
					}
				})
			)
		);
	}

	// Возвращает текст, по которому выполняется поиск, для одного элемента
	protected getItemSearchText(entry: FilterCheckboxItem<T>): string {
		const raw: unknown = entry.item;
		const name = (raw as { name?: unknown }).name;

		return typeof name === 'string' ? name : '';
	}

	// Нормализует строку для корректного поиска (регистр, пробелы, диакритика, ё/е)
	private normalizeSearch(text: string): string {
		return text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/ё/g, 'е')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, ' ');
	}

	// Фильтруем выбранные элементы по поисковому запросу
	public searchSelectedItem(query: string | null): void {
		const selectedItems = this.selectedItems$.value;

		const normalizedQuery = this.normalizeSearch(query ?? '');

		if (!normalizedQuery) {
			this.viewSelectedItems$.next(selectedItems);
			return;
		}

		const tokens = normalizedQuery.split(' ');

		const filtered = selectedItems.filter((entry) => {
			const text = this.normalizeSearch(this.getItemSearchText(entry));
			if (!text) return false;

			return tokens.every((t) => text.includes(t));
		});

		this.viewSelectedItems$.next(filtered);
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

	public ngOnDestroy(): void {
		this.subscribers.forEach((sub) => sub.unsubscribe());
	}
}
