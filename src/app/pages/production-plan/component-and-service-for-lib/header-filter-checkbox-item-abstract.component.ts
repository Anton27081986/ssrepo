import {
	Component,
	inject,
	model,
	ModelSignal,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	BehaviorSubject,
	Observable,
	switchMap,
	tap,
	combineLatest,
	map,
	take,
	shareReplay,
	of,
	throttleTime,
	asyncScheduler,
} from 'rxjs';
import { HeaderFilterCheckboxSearchAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/header-filter-checkbox-abstract.component';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { IId } from '@app/pages/production-plan/component-and-service-for-lib/i-id';
import { toSignal } from '@angular/core/rxjs-interop';
import { IFilterCriterionType } from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
import {
	TextType,
	TextWeight,
	Colors,
	ExtraSize,
	IconType,
} from '@front-library/components';
import { Subscription } from 'rxjs';

@Component({
	template: ``,
	imports: [],
})
export abstract class HeaderFilterCheckboxItemAbstractComponent<T extends IId>
	extends HeaderFilterCheckboxSearchAbstractComponent<T>
	implements OnInit, OnDestroy
{
	protected readonly selectedIds$ = new BehaviorSubject<number[]>([]);
	protected readonly selectedItems$: Observable<T[]>;
	protected readonly _headerFilterService = inject(HeaderFilterService);

	public readonly controlsClearAll: FormControl<boolean | null> =
		new FormControl<boolean | null>(null);

	public indeterminate: ModelSignal<boolean> = model(false);

	public readonly controlsMap: {
		[id: string]: FormControl<boolean | null>;
	} = {};

	public currentControlsMap: {
		[id: string]: FormControl<boolean | null>;
	} = {};

	protected readonly ExtraSize = ExtraSize;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Colors = Colors;
	protected readonly IconType = IconType;

	public override subscribers: Subscription[] = [];

	protected constructor() {
		super();

		toSignal(
			this.controlsClearAll.valueChanges.pipe(
				tap((value) => {
					this.indeterminate.set(false);
					Object.keys(this.currentControlsMap).forEach((key) => {
						const control = this.currentControlsMap[key];
						control.setValue(false);
						this.controlsClearAll.setValue(false, {
							emitEvent: false,
						});
					});
				}),
			),
		);

		this.selectedItems$ = this.selectedIds$.pipe(
			take(1),
			switchMap((ids) => {
				if (ids.length === 0) {
					return of([]);
				}
				return this.searchActive$(ids);
			}),
			shareReplay({
				bufferSize: 1,
				refCount: true,
			}),
		);
	}

	private calcIndeterminate(): void {
		const trueCount = this.getTrueControlsCount();

		if (trueCount === 0) {
			this.indeterminate.set(false);
			this.controlsClearAll.setValue(false, { emitEvent: false });

			return;
		}

		this.indeterminate.set(true);
		this.controlsClearAll.setValue(false, { emitEvent: false });
	}

	public search$(searchTerm: string | null): Observable<T[]> {
		if (searchTerm === null) {
			return combineLatest([
				this.selectedItems$,
				this.getList$(searchTerm ?? ''),
			]).pipe(
				map(([items1, items2]) => {
					const newArray = [...items1];
					const firstIds = items1.map((i) => i.id);
					items2.forEach((item) => {
						if (!firstIds.includes(item.id)) {
							newArray.push(item);
						}
					});
					return newArray;
				}),
			);
		}
		return this.getList$(searchTerm ?? '');
	}

	public ngOnInit(): void {
		this.subscribers.push(
			this.items$
				.pipe(
					tap((items) => {
						const newCurrentControlsMap: {
							[id: string]: FormControl<boolean | null>;
						} = {};

						for (const item of items) {
							const id = item.id.toString();
							newCurrentControlsMap[id] = this.resolveControl(
								item.id,
							);
						}

						this.currentControlsMap = newCurrentControlsMap;

						this.calcIndeterminate();
					}),
				)
				.subscribe(),
		);

		const foundFilter = this._headerFilterService.filters.find(
			(item) => item.field === this.field(),
		);

		if (foundFilter) {
			this.selectedIds$.next(this.initSelectedIds(foundFilter.value));
		}

		this.subscribers.push(
			this.selectedIds$
				.pipe(
					throttleTime(200, asyncScheduler, {
						leading: false,
						trailing: true,
					}),
					tap((ids) => {
						const value = ids.length ? ids : null;
						this.valueEmit.emit(value);
						this._headerFilterService.setValueItemFilter(
							value,
							this.field(),
						);
						this.calcIndeterminate();
					}),
				)
				.subscribe(),
		);
	}

	private initSelectedIds(value: IFilterCriterionType): number[] {
		if (Array.isArray(value)) {
			return value;
		}

		return [];
	}

	protected resolveControl(id: number): FormControl<boolean | null> {
		let control = this.controlsMap[id];
		if (!control) {
			const checked = this.selectedIds$.value.includes(id);

			control = new FormControl<boolean | null>(checked);

			this.subscribers.push(
				control.valueChanges.subscribe((val) => {
					const currentIds = [...this.selectedIds$.value];
					if (val) {
						if (!currentIds.includes(Number(id))) {
							this.selectedIds$.next([id, ...currentIds]);
						}
					} else {
						const index = currentIds.indexOf(id);
						if (index !== -1) {
							currentIds.splice(index, 1);
							this.selectedIds$.next(currentIds);
						}
					}
				}),
			);
			this.controlsMap[id] = control;
		}
		return control;
	}

	public getTrueControlsCount(): number {
		return Object.values(this.currentControlsMap).filter(
			(control) => control.value === true,
		).length;
	}

	public ngOnDestroy(): void {
		this.subscribers.forEach((sub) => sub.unsubscribe());
	}
}
