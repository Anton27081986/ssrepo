import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessage } from '@app/core/models/correspondence/message';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';

@Component({
	selector: 'ss-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
	public messages$: Observable<{ items: IMessage[]; total: number } | null>;
	constructor(private readonly storeService: NotificationsStoreService) {
		this.messages$ = this.storeService.messages$;
	}
}
