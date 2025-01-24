import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

@Component({
	selector: 'app-not-permission-page',
	templateUrl: './not-permission-page.component.html',
	styleUrls: ['./not-permission-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeadlineComponent,
		TextComponent,
		ButtonComponent,
		RouterLink
	],
	standalone: true
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
