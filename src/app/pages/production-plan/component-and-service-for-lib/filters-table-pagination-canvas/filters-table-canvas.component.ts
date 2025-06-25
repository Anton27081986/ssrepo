import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	type InputSignal,
	type TemplateRef,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FilterMenuItemComponent } from '@app/pages/production-plan/component-and-service-for-lib/filter-menu-item/filter-menu-item.component';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { FilterMenuComponent } from '@app/pages/production-plan/component-and-service-for-lib/filter-menu/filter-menu.component';

@Component({
	selector: 'ss-lib-table-filters-canvas',
	templateUrl: 'filters-table-canvas.component.html',
	styleUrls: ['filters-table-canvas.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		AsyncPipe,
		NgIf,
		FilterMenuItemComponent,
		NgFor,
		FilterMenuComponent,
	],
})
export class FiltersTableCanvasComponent {
	public readonly leftFiltersRef: InputSignal<TemplateRef<{}> | null> =
		input.required();

	public readonly rightFiltersRef: InputSignal<TemplateRef<{}> | null> =
		input.required();

	public readonly tableRef: InputSignal<TemplateRef<{}> | null> =
		input.required();

	public readonly paginationRef: InputSignal<TemplateRef<{}> | null> =
		input.required();

	public readonly filterService: HeaderFilterService =
		inject(HeaderFilterService);
}
