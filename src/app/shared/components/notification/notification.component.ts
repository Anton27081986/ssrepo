import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonType, IconPosition, IconType, Size } from "@front-components/components";
import { NotificationImports } from "@app/shared/components/notification/notification.imports";

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: NotificationImports,
	standalone: true
})
export class NotificationComponent {

	public toNotifications() {
		window.open("https://cisp.ssnab.ru/Personal/Votes", '_blank');
	}

	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly Size = Size;
}
