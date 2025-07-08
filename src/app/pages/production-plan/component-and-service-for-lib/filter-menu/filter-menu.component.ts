import { Component, inject } from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import { FilterMenuItemComponent } from '@app/pages/production-plan/component-and-service-for-lib/filter-menu-item/filter-menu-item.component';
import { NgForOf, NgIf } from '@angular/common';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import {
	ButtonComponent,
	ButtonType,
	IconType,
} from '@front-library/components';
import { IconPosition } from '@front-components/components';

@Component({
	selector: 'ss-lib-filter-menu',
	standalone: true,
	imports: [FilterMenuItemComponent, NgForOf, ButtonComponent, NgIf],
	templateUrl: './filter-menu.component.html',
	styleUrl: './filter-menu.component.scss',
	animations: [rotateAnimation],
})
export class FilterMenuComponent {
	filterService: HeaderFilterService = inject(HeaderFilterService);

	get checkActiveFilter(): boolean {
		return this.filterService.menuFilterItems.length > 0;
	}

	protected clearAll() {
		this.filterService.removeFilterAllMenu();
	}

	protected readonly ButtonComponent = ButtonComponent;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
}
