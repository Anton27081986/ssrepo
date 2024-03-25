import { Component } from '@angular/core';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';
import { Observable } from 'rxjs';
import { IMessage } from '@app/core/models/correspondence/message';

@Component({
	selector: 'ss-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.scss'],
})
export class TopicComponent {
	public subjects$: Observable<string[]>;
	public messages$: Observable<{ items: IMessage[]; total: number } | null>;
	constructor(private readonly storeService: NotificationsStoreService) {
		this.subjects$ = this.storeService.subjects$;
		this.messages$ = this.storeService.messages$;
	}
}
