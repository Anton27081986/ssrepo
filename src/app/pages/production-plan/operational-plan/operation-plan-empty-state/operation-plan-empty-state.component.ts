import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	InputSignal,
} from '@angular/core';
import {
	Align,
	BadgeComponent,
	ButtonComponent,
	Colors,
	ExtraSize,
	IconType,
	Status,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-operation-plan-empty-state',
	standalone: true,
	imports: [BadgeComponent, TextComponent, ButtonComponent, NgIf],
	templateUrl: './operation-plan-empty-state.component.html',
	styleUrl: './operation-plan-empty-state.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [],
})
export class OperationPlanEmptyStateComponent {
	public title: InputSignal<string> = input.required();
	public description: InputSignal<string> = input.required();
	public icon: InputSignal<IconType> = input.required();
	public viewAddButton: InputSignal<boolean> = input.required();

	protected readonly operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	private readonly weekId$ = this.operationPlanState.weekId$;
	private readonly operationPlanPopupService: OperationPlanPopupService =
		inject(OperationPlanPopupService);

	protected readonly TextType = TextType;
	protected readonly Status = Status;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;
	protected readonly Colors = Colors;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;

	protected addSemiManufactures(): void {
		const weekId = this.weekId$.value;

		if (weekId !== null) {
			this.operationPlanPopupService.addSemiManufactures(weekId);
		}
	}
}
