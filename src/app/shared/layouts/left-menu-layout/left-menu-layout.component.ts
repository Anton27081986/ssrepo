import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzMenuDirective} from "ng-zorro-antd/menu";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {RouterOutlet} from "@angular/router";

@Component({
	selector: 'app-left-menu-layout',
	templateUrl: './left-menu-layout.component.html',
	styleUrls: ['./left-menu-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NzLayoutComponent,
		NzSiderComponent,
		NzMenuDirective,
		NzHeaderComponent,
		NzIconDirective,
		NzContentComponent,
		RouterOutlet
	],
	standalone: true
})
export class LeftMenuLayoutComponent {
	public isCollapsed = false;
}
