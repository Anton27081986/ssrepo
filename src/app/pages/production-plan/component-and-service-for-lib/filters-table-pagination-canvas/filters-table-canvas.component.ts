import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	input,
	type InputSignal,
	type TemplateRef,
} from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { FilterMenuComponent } from '@app/pages/production-plan/component-and-service-for-lib/filter-menu/filter-menu.component';

@Component({
	selector: 'ss-lib-table-canvas',
	templateUrl: 'filters-table-canvas.component.html',
	styleUrls: ['filters-table-canvas.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		NgIf,
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

	public readonly viewPagination: InputSignal<boolean> = input(true);

	filterService: HeaderFilterService = inject(HeaderFilterService);

	get checkActiveFilter(): boolean {
		return this.filterService.menuFilterItems.length > 0;
	}
}
