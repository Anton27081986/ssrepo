import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-manager',
	templateUrl: './manager.component.html',
	styleUrls: ['./manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerComponent {}
