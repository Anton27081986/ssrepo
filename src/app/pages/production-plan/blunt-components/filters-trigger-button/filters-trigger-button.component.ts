import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	HeaderFilterService,
	IconType,
	IFilterItem,
	PopoverTriggerForDirective,
} from '@front-library/components';
import { NgForOf } from '@angular/common';
import { IconPosition } from '@front-components/components';

@Component({
	selector: 'app-filters-trigger-button',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownListComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
		NgForOf,
	],
	templateUrl: './filters-trigger-button.component.html',
	styleUrl: './filters-trigger-button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersTriggerButtonComponent {
	protected readonly filterService: HeaderFilterService =
		inject(HeaderFilterService);

	protected filters: IFilterItem[] = this.filterService.filterItems;

	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
	protected addFilterMenu(filter: IFilterItem): void {
		if (!filter.active) {
			filter.active = true;
			this.filterService.addFilterMenu(filter);
		}
	}

	protected readonly ExtraSize = ExtraSize;
}
