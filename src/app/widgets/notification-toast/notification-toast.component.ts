import { Component } from '@angular/core';
import { NotificationToastService, IToast } from '@app/core/services/notification-toast.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'ss-notification-toast',
	templateUrl: './notification-toast.component.html',
	styleUrls: ['./notification-toast.component.scss'],
})
export class NotificationToastComponent {
	public toasts$: Observable<IToast[]>;
	constructor(private readonly notificationToastService: NotificationToastService) {
		this.toasts$ = this.notificationToastService.notificationsStorage$;
	}

	deleteToast(id: number) {
		this.notificationToastService.deleteToast(id);
	}
}
