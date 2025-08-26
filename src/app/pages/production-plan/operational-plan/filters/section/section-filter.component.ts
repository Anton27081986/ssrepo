import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	InputSignal,
	OnInit,
	signal,
	WritableSignal,
} from '@angular/core';
import { OperationPlanFiltersApiService } from '@app/pages/production-plan/service/operation-plan.filters-api-service';
import {
	CheckboxComponent,
	Colors,
	DividerComponent,
	DropdownItemComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	HeaderFilterService,
	IconType,
	InputComponent,
	ScrollbarComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import {
	BehaviorSubject,
	map,
	of,
	switchMap,
	merge,
	tap,
	debounceTime,
} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SectionGroupDropdownItemComponent } from '@app/pages/production-plan/operational-plan/filters/section/section-group-dropdown-item/section-group-dropdown-item.component';

export interface SectionItem {
	id: number;
	name: string;
	control: FormControl<boolean | null>;
	children: SectionItem[] | null;
}

@UntilDestroy()
@Component({
	selector: 'app-section-filter',
	standalone: true,
	imports: [
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		ReactiveFormsModule,
		TextComponent,
		NgIf,
		DropdownItemComponent,
		NgFor,
		ScrollbarComponent,
		DividerComponent,
		SectionGroupDropdownItemComponent,
		CheckboxComponent,
	],
	templateUrl: './section-filter.component.html',
	styleUrl: 'section-filter.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFilterComponent implements OnInit {
	public field: InputSignal<string> = input.required();

	private readonly headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	private readonly filterApiService: OperationPlanFiltersApiService = inject(
		OperationPlanFiltersApiService
	);

	protected readonly selectedIds$ = new BehaviorSubject<number[]>([]);

	protected readonly queryControl: FormControl<null | string> =
		new FormControl(null);

	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;

	public items: WritableSignal<SectionItem[]> = signal([]);

	public selectedItems: WritableSignal<SectionItem[]> = signal([]);

	public ngOnInit(): void {
		const filter = this.headerFilterService.getFilter(this.field());

		if (filter.value?.length) {
			this.filterApiService
				.getProductionSection('', filter.value, true)
				.pipe(
					map((val) => {
						const itemsMap = val.items.map((item) => {
							return {
								id: item.id,
								name: item.name,
								control: new FormControl<boolean>(false),
								children: null,
							};
						});

						const mapParentItems = val.parentItems.map((item) => {
							return {
								id: item.data.id,
								name: item.data.name,
								control: new FormControl<boolean>(false),
								// eslint-disable-next-line @typescript-eslint/no-shadow
								children: item.childs.map((item) => {
									return {
										id: item.id,
										name: item.name,
										control: new FormControl<boolean>(
											false
										),
									};
								}),
							};
						});

						return [...mapParentItems, ...itemsMap];
					})
				)
				.subscribe((val) => {
					this.selectedItems.set(val as SectionItem[]);
					this.updateSelectedIds();
				});
		}

		merge(of(''), this.queryControl.valueChanges)
			.pipe(
				debounceTime(500),
				switchMap((query) => {
					const ids: number[] = this.selectedItems().flatMap(
						(item) => {
							if (item.children) {
								item.control.setValue(true);

								return item.children.map((child) => {
									child.control.setValue(true);

									return child.id;
								});
							}

							item.control.setValue(true);

							return [item.id];
						}
					);

					return this.filterApiService.getProductionSection(
						query ?? '',
						ids,
						false
					);
				}),
				map((value) => {
					const itemsMap = value.items.map((item) => {
						return {
							id: item.id,
							name: item.name,
							control: new FormControl<boolean>(false),
							children: null,
						};
					});

					const mapParentItems = value.parentItems.map((item) => {
						return {
							id: item.data.id,
							name: item.data.name,
							control: new FormControl<boolean>(false),
							// eslint-disable-next-line @typescript-eslint/no-shadow
							children: item.childs.map((item) => {
								return {
									id: item.id,
									name: item.name,
									control: new FormControl<boolean>(false),
								};
							}),
						};
					});

					return [...mapParentItems, ...itemsMap];
				}),
				tap((value) => {
					this.items.set(value as SectionItem[]);
				}),
				untilDestroyed(this)
			)
			.subscribe();

		this.selectedIds$.pipe(untilDestroyed(this)).subscribe((ids) => {
			this.headerFilterService.setValueItemFilter(ids, this.field());
		});
	}

	protected toggleSelectionNotChildren(item: SectionItem): void {
		const isSelected = this.selectedItems().some(
			(selected) => selected.id === item.id
		);

		if (isSelected) {
			// Снять выбор: убрать из выбранных и вернуть в общий список (если его там нет)
			this.selectedItems.set(
				this.selectedItems().filter(
					(selected) => selected.id !== item.id
				)
			);

			const existsInItems = this.items().some((i) => i.id === item.id);

			if (!existsInItems) {
				this.items.set([
					...this.items(),
					{
						id: item.id,
						name: item.name,
						children: null,
						control: new FormControl<boolean>(false),
					},
				]);
			} else {
				// Добавить в выбранные и удалить из общего списка
				this.selectedItems.set([...this.selectedItems(), item]);
				this.items.set(this.items().filter((i) => i.id !== item.id));
			}
		}

		this.updateSelectedIds();
	}

	protected removeSelectionNotChildren(item: SectionItem): void {
		const isSelected = this.selectedItems().some(
			(selected) => selected.id === item.id
		);

		if (isSelected) {
			// Удалить из выбранных и вернуть в общий список
			this.selectedItems.set(
				this.selectedItems().filter(
					(selected) => selected.id !== item.id
				)
			);

			const existsInItems = this.items().some((i) => i.id === item.id);

			if (!existsInItems) {
				this.items.set([
					{
						id: item.id,
						name: item.name,
						children: null,
						control: new FormControl<boolean>(false),
					},
					...this.items(),
				]);
			}
		} else {
			// Добавить в выбранные и удалить из общего списка
			this.selectedItems.set([item, ...this.selectedItems()]);
			this.items.set(this.items().filter((i) => i.id !== item.id));
		}

		this.updateSelectedIds();
	}

	protected toggleSelectionChildren(
		target: SectionItem,
		parent: SectionItem
	): void {
		const isSelected = this.selectedItems().some((selected) =>
			selected.children!.some((child) => child.id === target.id)
		);

		if (!isSelected) {
			this.addSelectionChildren(target, parent);
		} else {
			this.removeSelectionChildren(target, parent);
		}

		this.updateSelectedIds();
	}

	private addSelectionChildren(
		target: SectionItem,
		parent: SectionItem
	): void {
		const selected = this.selectedItems();

		const parentSelected = this.selectedItems().find(
			// eslint-disable-next-line @typescript-eslint/no-shadow
			(selected) => selected.id === parent.id
		);

		if (parentSelected) {
			parentSelected.children!.unshift(target);
		} else {
			const newObj = {
				id: parent.id,
				name: parent.name,
				control: new FormControl<boolean>(false),
				children: [target],
			};

			this.selectedItems.set([newObj, ...selected]);
		}

		parent.children = parent.children!.filter(
			(item) => item.id !== target.id
		);

		if (parent.children.length === 0) {
			this.items.set(
				this.items().filter((item) => item.id !== parent.id)
			);
		}
	}

	private removeSelectionChildren(
		target: SectionItem,
		parent: SectionItem
	): void {
		const items = this.items();

		const parentTarget = this.items().find(
			(selected) => selected.id === parent.id
		);

		if (parentTarget) {
			parentTarget.children!.unshift(target);
		} else {
			const newObj = {
				id: parent.id,
				name: parent.name,
				control: new FormControl<boolean>(false),
				children: [target],
			};

			this.items.set([newObj, ...items]);
		}

		parent.children = parent.children!.filter(
			(item) => item.id !== target.id
		);

		if (parent.children.length === 0) {
			this.selectedItems.set(
				this.selectedItems().filter((item) => item.id !== parent.id)
			);
		}
	}

	protected updateSelectedIds(): void {
		const ids: number[] = this.selectedItems().flatMap((item) => {
			if (item.children) {
				item.control.setValue(true);

				return item.children.map((child) => {
					child.control.setValue(true);

					return child.id;
				});
			}

			item.control.setValue(true);

			return [item.id];
		});

		this.selectedIds$.next(ids);

		this.items().forEach((item) => {
			item.control.setValue(false);

			if (item.children) {
				item.children.forEach((it) => it.control.setValue(false));
			}
		});
	}

	protected toggleParent(parent: SectionItem, remove: boolean): void {
		if (remove) {
			const parentTarget = this.items().find(
				(selected) => selected.id === parent.id
			);

			if (parentTarget) {
				parentTarget.children = [
					...(parent.children ?? []),
					...(parentTarget.children ?? []),
				];
			} else {
				this.items.set([parent, ...this.items()]);
			}

			this.selectedItems.set(
				this.selectedItems().filter((item) => item.id !== parent.id)
			);
		} else {
			const parentTarget = this.selectedItems().find(
				(selected) => selected.id === parent.id
			);

			if (parentTarget) {
				parentTarget.children = [
					...(parent.children ?? []),
					...(parentTarget.children ?? []),
				];
			} else {
				this.selectedItems.set([parent, ...this.selectedItems()]);
			}

			this.items.set(
				this.items().filter((item) => item.id !== parent.id)
			);
		}

		this.updateSelectedIds();
	}
}
