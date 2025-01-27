import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {NzDropDownADirective, NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {NzMenuDirective} from "ng-zorro-antd/menu";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NzAvatarComponent,
		IconComponent,
		NzDropDownADirective,
		NzDropDownDirective,
		NgIf,
		NzDropdownMenuComponent,
		NzMenuDirective,
		NzIconDirective,
		NzButtonComponent,
		RouterLink,
		NgScrollbar,
		NzListComponent,
		NzListItemComponent,
		NgClass
	],
	standalone: true
})
export class NotificationComponent {
	public notificationList = [
		{
			title: 'You received a new message',
			time: '8 min',
			icon: 'mail',
			color: 'ant-avatar',
		},
	];
}
