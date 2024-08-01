import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-mobile-menu',
	templateUrl: './mobile-menu.component.html',
	styleUrls: ['./mobile-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
	@Input() menu: any;
}
