import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-info-section',
	standalone: true,
	template: `
		<div class="info-section">
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['./info-section.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoSectionComponent {}
