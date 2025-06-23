import {
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	InputSignal,
	Output,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownListComponent,
	ExtraSize,
	IconComponent,
	IconType,
	PopoverTriggerForDirective,
} from '@front-library/components';
import {
	IFilterCriteria,
	IFilterItem,
} from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { NgComponentOutlet } from '@angular/common';
import { IconPosition } from '@front-components/components';
import { rotateAnimation } from '@app/core/animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
	selector: 'ss-lib-filter-menu-item',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownListComponent,
		PopoverTriggerForDirective,
		NgComponentOutlet,
		IconComponent,
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

	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Colors = Colors;

	constructor() {
		toSignal(
			this.headerFilterService.criteria$.pipe(
				tap((value) => {
					this.valueSelected.set(this.calcValueSelected());
				}),
			),
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
