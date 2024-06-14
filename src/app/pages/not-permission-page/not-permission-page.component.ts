import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';

@Component({
	selector: 'app-not-permission-page',
	templateUrl: './not-permission-page.component.html',
	styleUrls: ['./not-permission-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotPermissionPageComponent {
	protected readonly AppRoutes = AppRoutes;
}
