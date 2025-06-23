import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import {
	ButtonComponent,
	IDictionaryItemDto,
	SharedPopupService,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './operational-plan.component.html',
	styleUrl: './operational-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalPlanComponent {
	private operationalPlan: OperationPlanService =
		inject(OperationPlanService);

	protected weeks: Signal<IDictionaryItemDto[]> = toSignal(
		this.operationalPlan.getWeeks(),
		{ initialValue: [] },
	);

	private popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	protected openPostponePlanModal(id: number) {
		this.popupService.openPostponePlanModal(id);
	}
}
