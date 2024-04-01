import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-left-menu-layout',
	templateUrl: './left-menu-layout.component.html',
	styleUrls: ['./left-menu-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftMenuLayoutComponent {
	public isCollapsed = false;
}
