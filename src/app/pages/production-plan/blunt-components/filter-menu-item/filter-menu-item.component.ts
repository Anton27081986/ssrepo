import {
	Component,
	computed,
	inject,
	input,
	InputSignal,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownListComponent,
	ExtraSize,
	HeaderFilterService,
	IconComponent,
	IconPosition,
	IconType,
	IFilterCriteria,
	IFilterItem,
	PopoverTriggerForDirective,
} from '@front-library/components';
import { rotateAnimation } from '@app/core/animations';

@Component({
	selector: 'app-filter-menu-item',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownListComponent,
		PopoverTriggerForDirective,
		NgComponentOutlet,
		IconComponent,
		ButtonComponent,
	],
	templateUrl: './filter-menu-item.component.html',
	styleUrl: './filter-menu-item.component.scss',
	animations: [rotateAnimation],
})
export class FilterMenuItemComponent {
	public headerFilterService: HeaderFilterService =
		inject(HeaderFilterService);

	public filter: InputSignal<IFilterItem> = input.required();

	public filterCriteria: Signal<IFilterCriteria> = computed(() => {
		return this.headerFilterService.getFilter(this.filter().field);
	});

	public valueSelected: WritableSignal<string> = signal('0');

	protected readonly ExtraSize = ExtraSize;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
	protected readonly ButtonType = ButtonType;
	protected readonly Colors = Colors;
	constructor() {
		toSignal(
			this.headerFilterService.criteria$.pipe(
				tap(() => {
					this.valueSelected.set(this.calcValueSelected());
				})
			)
		);
	}

	protected calcValueSelected(): string {
		if (this.filterCriteria().value === null) {
			return '0';
		}

		if (Array.isArray(this.filterCriteria().value)) {
			return this.filterCriteria().value!.length.toString();
		}

		return this.filterCriteria().value!.toString();
	}

	protected removeFilter(filter: IFilterItem): void {
		filter.active = false;
		this.headerFilterService.removeFilterMenu(filter);
	}
}
