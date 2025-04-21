import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
import { TableState } from '@app/shared/components/table/table-state';
import { Observable } from 'rxjs';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TopicComponent } from '@app/widgets/correspondence/topic/topic.component';
import { MessagesComponent } from '@app/widgets/correspondence/messages/messages.component';
import { MailComponent } from '@app/widgets/correspondence/mail/mail.component';
import { CardDropdownComponent } from '@app/shared/components/card-dropdown/card-dropdown.component';

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
	imports: [
		CommonModule,
		LoaderComponent,
		NgIf,
		AsyncPipe,
		TopicComponent,
		MessagesComponent,
		MailComponent,
		CardDropdownComponent,
	],
	standalone: true,
})
export class CorrespondenceComponent implements OnChanges {
	@Input()
	public objectId: number | undefined;

	public isLoading$: Observable<boolean>;

	protected readonly TableState = TableState;
	constructor(
		private readonly notificationsFacadeService: CorrespondenceFacadeService,
	) {
		this.isLoading$ = this.notificationsFacadeService.isLoading$;
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.objectId && this.objectId) {
			this.notificationsFacadeService.setObjectId(this.objectId);
		}
	}
}
