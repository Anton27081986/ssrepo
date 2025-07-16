import { Component, OnInit } from '@angular/core';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
import { Observable } from 'rxjs';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
	selector: 'ss-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.scss'],
	imports: [
		CommonModule,
		SearchInputComponent,
		IconComponent,
		HeadlineComponent,
		TextComponent,
		AsyncPipe,
	],
	standalone: true,
})
export class TopicComponent {
	public topics$: Observable<Array<{ subject: string; messageCount: number }>>;
	public totalMessages$: Observable<number>;

	constructor(private readonly facadeService: CorrespondenceFacadeService) {
		this.topics$ = this.facadeService.topics$;
		this.totalMessages$ = this.facadeService.totalMessages$;
	}

	ngOnInit() {
		this.facadeService.loadMessages();
		this.facadeService.loadFiles();
	}

	onTopic(subject: string | null = null) {
		this.facadeService.selectSubject(subject);
	}

	filterSubjectsByName($event: Event) {
		const target = $event.target as HTMLInputElement;

		this.facadeService.loadSubjects(target.value);
	}
}
