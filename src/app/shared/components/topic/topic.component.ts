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
	public subjects: Array<{ subject: string; messageCount: number }> | undefined;
	public subjectsDefault: Array<{ subject: string; messageCount: number }> | undefined;
	public messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	public totalMessages$: Observable<number>;

	constructor(private readonly facadeService: NotificationsFacadeService) {
		this.subjects$ = this.facadeService.subjects$;
		this.messages$ = this.facadeService.messages$;
		this.totalMessages$ = this.facadeService.totalMessages$;
	}

	ngOnInit() {
		this.facadeService.loadSubjects(this.objectId).pipe().subscribe();

		this.subjects$.subscribe(subjects => {
			if (subjects.length > 0) {
				this.subjects = subjects;
				this.subjectsDefault = subjects;
			}
		});
	}

	onTopic(subject: string | null = null) {
		this.facadeService.selectSubject(subject);
	}

	filterBySubject($event: Event) {
		const target = $event.target as HTMLInputElement;

		this.subjects = [];

		if (target.value.length > 0) {
			this.subjectsDefault?.forEach((element: any) => {
				if (
					element.subject.toLowerCase().indexOf(String(target.value).toLowerCase()) !== -1
				) {
					this.subjects?.push(element);
				}
			});
		} else {
			this.subjects = this.subjectsDefault;
		}
	}
}
