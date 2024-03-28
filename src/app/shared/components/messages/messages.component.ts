import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';

@Component({
	selector: 'ss-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
	public messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	public subject$: Observable<string | null>;
	public user$: Observable<IUserProfile | null>;
	constructor(
		private readonly storeService: NotificationsStoreService,
		private readonly userService: UserProfileStoreService,
	) {
		this.messages$ = this.storeService.messages$;
		this.subject$ = this.storeService.selectedSubject$;
		this.user$ = this.userService.userProfile$;
	}

	downloadFile(url: string, fileName: string) {
		const link = document.createElement('a');
		link.href = url;
		link.target = '_blank';
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
