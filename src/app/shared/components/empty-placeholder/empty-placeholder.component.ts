import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'ss-empty-placeholder',
	templateUrl: './empty-placeholder.component.html',
	styleUrls: ['./empty-placeholder.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class EmptyPlaceholderComponent {}
