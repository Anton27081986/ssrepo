import { Component, Input } from '@angular/core';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';
import { Observable } from 'rxjs';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';

@Component({
	selector: 'ss-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.scss'],
})
export class TopicComponent {
	@Input() public objectId!: number;
	public subjects$: Observable<Array<{ subject: string; messageCount: number }>>;
	public messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	public totalMessages$: Observable<number>;

	constructor(private readonly storeService: NotificationsStoreService) {
		this.subjects$ = this.storeService.subjects$;
		this.messages$ = this.storeService.messages$;
		this.totalMessages$ = this.storeService.totalMessages$;
	}

	onTopic(subject?: string) {
		this.storeService.loadMessages(this.objectId, subject).pipe().subscribe();
	}
}
