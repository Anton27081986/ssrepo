import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsFacadeService } from '@app/core/facades/notifications-facade.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { IUserDto } from '@app/core/models/notifications/user-dto';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';

enum CorrespondenceTabsEnum {
	'Messages',
	'Files',
}

@UntilDestroy()
@Component({
	selector: 'ss-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
	@Input() objectId!: number;
	public currentUserId: number | undefined;

	protected messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	protected subject$: Observable<string | null>;
	protected user$: Observable<IUserProfile | null>;
	protected files$: Observable<{ items: IAttachmentDto[]; total: number } | null>;

	protected tabs: string[] = ['Все сообщения по клиенту', 'Вложения'];

	protected selectedTab: CorrespondenceTabsEnum = CorrespondenceTabsEnum.Messages;

	@ViewChild('messages') public messagesElement!: ElementRef;

	@Output() public selectMessageToReply = new EventEmitter<{
		message: IMessageItemDto;
		toUsers: IUserDto[];
	}>();

	public pageIndex = 1;
	public pageSize = 10;
	public total = 0;
	public offset = 0;

	public isLoading = false;

	public constructor(
		private readonly notificationsApiService: NotificationsApiService,
		private readonly notificationsFacadeService: NotificationsFacadeService,
		private readonly userService: UserProfileStoreService,
	) {
		this.messages$ = this.notificationsFacadeService.messages$;
		this.files$ = this.notificationsFacadeService.files$;
		this.subject$ = this.notificationsFacadeService.selectedSubject$;
		this.user$ = this.userService.userProfile$;
	}

	protected downloadFile(url: string, fileName: string) {
		const link = document.createElement('a');

		link.href = url;
		link.target = '_blank';
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public ngOnInit() {
		this.subject$.pipe(untilDestroyed(this)).subscribe(subject => {
			this.selectedTab = CorrespondenceTabsEnum.Messages;
			this.tabs = [subject || 'Все сообщения по клиенту', 'Вложения'];
			this.scrollToBottom();
			this.notificationsFacadeService
				.loadFiles(this.objectId, subject || undefined)
				.pipe(untilDestroyed(this))
				.subscribe();

			this.pageIndex = 1;
			this.pageSize = 10;
			this.total = 0;
			this.offset = 0;
			this.loadMessages();
		});

		this.notificationsFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe(user => {
				this.currentUserId = user?.id;
			});
	}

	protected loadMessages() {
		this.notificationsFacadeService
			.loadMessages(this.objectId, this.pageSize, this.offset)
			.pipe(untilDestroyed(this))
			.subscribe(res => {
				if (this.pageIndex === 1) {
					this.scrollToBottom();
				}

				this.total = res.total;
				this.isLoading = false;
			});
	}

	protected scrollToBottom(): void {
		try {
			this.messagesElement.nativeElement.scrollTop =
				this.messagesElement.nativeElement.scrollHeight;
		} catch (err) {
			console.log(err);
		}
	}

	protected loadMoreMessages() {
		if (
			this.messagesElement.nativeElement.scrollHeight -
				this.messagesElement.nativeElement.offsetHeight +
				this.messagesElement.nativeElement.scrollTop <
			100
		) {
			this.pageIndex = this.pageIndex += 1;

			this.offset = this.pageSize * this.pageIndex - this.pageSize;

			if (this.total > this.offset) {
				this.isLoading = true;
				this.loadMessages();
			}
		}
	}

	protected selectTab(name: string) {
		if (name === 'Вложения') {
			this.selectedTab = CorrespondenceTabsEnum.Files;
		} else {
			this.selectedTab = CorrespondenceTabsEnum.Messages;
		}
	}

	protected replyTo(message: IMessageItemDto, author: IUserDto, toUsers: IUserDto[] = []) {
		const users = [author, ...toUsers];

		this.notificationsFacadeService.selectSubject(message.subject!);
		this.selectMessageToReply.emit({
			message,
			toUsers: users.filter(
				(user, index) => index === users.findIndex(el => user.id === el.id),
			),
		});
	}

	protected changeVisibility(message: IMessageItemDto) {
		this.notificationsApiService
			.patchMessage(message.id!, { ...message, isPrivate: !message.isPrivate })
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.notificationsFacadeService.setMessageVisibility(
					message.id!,
					!message.isPrivate,
				);
			});
	}

	protected readonly CorrespondenceTabsEnum = CorrespondenceTabsEnum;

	protected searchByMessage($event: Event) {
		const target = $event.target as HTMLInputElement;

		if (target.value.length > 2) {
			this.notificationsFacadeService
				.searchByMessages(this.objectId, target.value)
				.pipe(untilDestroyed(this))
				.subscribe();
		} else {
			this.loadMessages();
		}
	}
}
