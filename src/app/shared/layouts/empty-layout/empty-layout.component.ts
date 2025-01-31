import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import {RouterOutlet} from "@angular/router";

@Component({
	selector: 'app-empty-layout',
	templateUrl: './empty-layout.component.html',
	styleUrls: ['./empty-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterOutlet
	],
	standalone: true
})
export class EmptyLayoutComponent {
	protected readonly AppRoutes = AppRoutes;
}
