import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-order-widgets',
	templateUrl: './order-widgets.component.html',
	styleUrls: ['./order-widgets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class OrderWidgetsComponent {}
