import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import {
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	DropdownItemComponent,
	DropdownListComponent,
	IconType,
	PopoverTriggerForDirective,
	TextComponent,
} from '@front-library/components';
import { IFilterItem } from '@app/pages/production-plan/component-and-service-for-lib/filter-items';
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
		CheckboxComponent,
		TextComponent,
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

	protected addFilterMenu(filter: IFilterItem): void {
		if (!filter.active) {
			filter.active = true;
			this.filterService.addFilterMenu(filter);
		}
	}

	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
}
