import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { UntilDestroy } from '@ngneat/until-destroy';
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {RouterLink} from "@angular/router";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IconComponent,
		RouterLink,
		TextComponent
	],
	standalone: true
})
export class FooterComponent {
	protected readonly AppRoutes = AppRoutes;
}
