import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-info-row',
	standalone: true,
	template: `
		<div class="info-row">
			<div class="info-label">
				<ng-content select="[label]"></ng-content>
			</div>

			<div class="info-value">
				<ng-content select="[value]"></ng-content>
			</div>
		</div>
	`,
	styleUrls: ['./info-row.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoRowComponent {}
