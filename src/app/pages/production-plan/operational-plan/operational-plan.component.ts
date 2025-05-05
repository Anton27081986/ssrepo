import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [],
	templateUrl: './operational-plan.component.html',
	styleUrl: './operational-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalPlanComponent {}
