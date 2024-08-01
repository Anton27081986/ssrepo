import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '@app/common/routes';

@Component({
	selector: 'app-empty-layout',
	templateUrl: './empty-layout.component.html',
	styleUrls: ['./empty-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayoutComponent {
	protected readonly AppRoutes = AppRoutes;
}
