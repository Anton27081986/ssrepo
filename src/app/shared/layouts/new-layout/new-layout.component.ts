import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-new-layout',
	templateUrl: './new-layout.component.html',
	styleUrls: ['./new-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewLayoutComponent {}
