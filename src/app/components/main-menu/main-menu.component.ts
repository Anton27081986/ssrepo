import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
	@Input() public menu: any;
}
