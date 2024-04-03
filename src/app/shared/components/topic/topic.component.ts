import { Component, Input, OnInit } from '@angular/core';
import { NotificationsFacadeService } from '@app/core/facades/notifications-facade.service';
import { Observable } from 'rxjs';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'ss-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
	@Input() public objectId!: number;
	public subjects$: Observable<Array<{ subject: string; messageCount: number }>>;
	public messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	public totalMessages$: Observable<number>;

	constructor(private readonly facadeService: NotificationsFacadeService) {
		this.subjects$ = this.facadeService.subjects$;
		this.messages$ = this.facadeService.messages$;
		this.totalMessages$ = this.facadeService.totalMessages$;
	}

	ngOnInit() {
		this.facadeService.loadSubjects(this.objectId).pipe().subscribe();
	}

	onTopic(subject?: string) {
		this.facadeService.loadMessages(this.objectId, subject).pipe(untilDestroyed(this)).subscribe();
	}
}
