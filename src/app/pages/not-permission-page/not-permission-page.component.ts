import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-not-permission-page',
	templateUrl: './not-permission-page.component.html',
	styleUrls: ['./not-permission-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotPermissionPageComponent {
	protected readonly AppRoutes = AppRoutes;

	constructor(
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
	) {
		if (this.activatedRoute.snapshot.queryParams.redirectUrl) {
			this.router.navigate([this.activatedRoute.snapshot.queryParams.redirectUrl]);
		}
	}
}
