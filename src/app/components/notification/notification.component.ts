import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
