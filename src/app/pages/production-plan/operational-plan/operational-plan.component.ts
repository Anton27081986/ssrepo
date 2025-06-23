import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import {
	ButtonComponent,
	IDictionaryItemDto,
	LoadPaginationComponent,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { BaseAbstractComponent } from '@app/pages/production-plan/component-and-service-for-lib/base-abstract-component';
import {
	OperationPlanItems,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { HeaderFilterService } from '@app/pages/production-plan/component-and-service-for-lib/header-filter.service';
import { operationPlanFilter } from '@app/pages/production-plan/operational-plan/operation-plan.filters';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		ButtonComponent,
		FiltersTableCanvasComponent,
		FiltersTriggerButtonComponent,
		LoadPaginationComponent,
	],
	templateUrl: './operational-plan.component.html',
	styleUrl: './operational-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HeaderFilterService],
})
export class OperationalPlanComponent
	extends BaseAbstractComponent<OperationPlanItems, OperationPlanRequest>
	implements OnInit
{
	private operationalPlanService: OperationPlanService =
		inject(OperationPlanService);

	protected weeks: Signal<IDictionaryItemDto[]> = toSignal(
		this.operationalPlanService.getWeeks(),
		{ initialValue: [] },
	);

	private popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	public loadItems(
		request: OperationPlanRequest & Pagination,
	): Observable<IResponse<OperationPlanItems>> {
		return this.operationalPlanService.getProductionPlan(request);
	}

	protected openPostponePlanModal(id: number) {
		this.popupService.openPostponePlanModal(id);
	}

	override ngOnInit() {
		this.filtersConfig = operationPlanFilter;
		super.ngOnInit();
	}
}
