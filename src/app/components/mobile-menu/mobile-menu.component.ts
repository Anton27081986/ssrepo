import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";

@Component({
	selector: 'app-mobile-menu',
	templateUrl: './mobile-menu.component.html',
	styleUrls: ['./mobile-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NzTabSetComponent,
		NzTabComponent,
		NgForOf,
		NzMenuDirective,
		NzSubMenuComponent,
		NzMenuItemComponent,
		NgIf
	],
	standalone: true
})
export class MobileMenuComponent {
	@Input() menu: any;
}
