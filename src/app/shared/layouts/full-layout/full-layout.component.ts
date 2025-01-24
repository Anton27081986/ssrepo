import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-full-layout',
	templateUrl: './full-layout.component.html',
	styleUrls: ['./full-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class FullLayoutComponent {}
