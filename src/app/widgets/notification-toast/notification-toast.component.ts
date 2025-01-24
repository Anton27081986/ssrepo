import { Component } from '@angular/core';
import { NotificationToastService, IToast } from '@app/core/services/notification-toast.service';
import { Observable } from 'rxjs';
import {NoticeComponent} from "@app/components/notice/notice.component";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'ss-notification-toast',
	templateUrl: './notification-toast.component.html',
	styleUrls: ['./notification-toast.component.scss'],
	imports: [
		NoticeComponent,
		AsyncPipe
	],
	standalone: true
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
