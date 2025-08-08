import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
	ButtonComponent,
	ButtonType,
	ExtraSize,
	HeaderFilterService,
	IconPosition,
} from '@front-library/components';
import { rotateAnimation } from '@app/core/animations';
import { FilterMenuItemComponent } from '@app/pages/production-plan/blunt-components/filter-menu-item/filter-menu-item.component';

@Component({
	selector: 'app-filter-menu-operation-plan',
	standalone: true,
	imports: [FilterMenuItemComponent, NgFor, ButtonComponent, NgIf],
	templateUrl: './filter-menu.component.html',
	styleUrl: './filter-menu.component.scss',
	animations: [rotateAnimation],
})
export class FilterMenuComponent {
	protected filterService: HeaderFilterService = inject(HeaderFilterService);

	protected get checkActiveFilter(): boolean {
		return this.filterService.menuFilterItems.length > 0;
	}

	protected clearAll(): void {
		this.filterService.removeFilterAllMenu();
	}

	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconPosition = IconPosition;
}
