import { Component, OnInit } from '@angular/core';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'ss-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
	public topics$: Observable<Array<{ subject: string; messageCount: number }>>;
	public totalMessages$: Observable<number>;

	ngOnInit() {
		this.facadeService.loadMessages();
		this.facadeService.loadFiles();
	}

	constructor(private readonly facadeService: CorrespondenceFacadeService) {
		this.topics$ = this.facadeService.topics$;
		this.totalMessages$ = this.facadeService.totalMessages$;
	}

	onTopic(subject: string | null = null) {
		this.facadeService.selectSubject(subject);
	}

	filterSubjectsByName($event: Event) {
		const target = $event.target as HTMLInputElement;

		this.facadeService.loadSubjects(target.value);
	}
}
