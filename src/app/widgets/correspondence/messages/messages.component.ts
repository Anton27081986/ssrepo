import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
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
export class MessagesComponent {
	protected messages$: Observable<{ items: IMessageItemDto[]; total: number } | null>;
	protected subject$: Observable<string | null>;
	protected user$: Observable<IUserProfile | null>;
	protected files$: Observable<{ items: IAttachmentDto[]; total: number } | null>;

	protected tabs: string[] = ['Все сообщения по клиенту', 'Вложения'];

	protected selectedTab: CorrespondenceTabsEnum = CorrespondenceTabsEnum.Messages;

	@ViewChild('messages') public messagesElement!: ElementRef;

	public pageIndex = 1;
	public pageSize = 10;
	public total = 0;
	public offset = 0;

	public isLoading = false;

	private searchText: string | undefined;

	public constructor(
		private readonly notificationsApiService: NotificationsApiService,
		private readonly notificationsFacadeService: CorrespondenceFacadeService,
		private readonly userService: UserProfileStoreService,
	) {
		this.messages$ = this.notificationsFacadeService.messages$;
		this.files$ = this.notificationsFacadeService.files$;
		this.subject$ = this.notificationsFacadeService.selectedSubject$;
		this.user$ = this.userService.userProfile$;

		this.subject$.pipe(untilDestroyed(this)).subscribe(subject => {
			this.selectedTab = CorrespondenceTabsEnum.Messages;
			this.tabs = [subject || 'Все сообщения по клиенту', 'Вложения'];
			this.pageIndex = 1;
			this.pageSize = 10;
			this.total = 0;
			this.offset = 0;
			this.isLoading = true;
		});

		this.messages$.pipe(untilDestroyed(this)).subscribe(() => {
			this.isLoading = false;

			if (this.pageIndex === 1) {
				this.scrollToBottom();
			}
		});
	}

	protected readonly CorrespondenceTabsEnum = CorrespondenceTabsEnum;

	protected downloadFile(url: string, fileName: string) {
		const link = document.createElement('a');

		link.href = url;
		link.target = '_blank';
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	protected scrollToBottom(): void {
		if (this.messagesElement) {
			try {
				this.messagesElement.nativeElement.scrollTop =
					this.messagesElement.nativeElement.scrollHeight;
			} catch (err) {
				console.log(err);
			}
		}
	}

	protected loadMoreMessages() {
		if (
			this.messagesElement.nativeElement.scrollHeight -
				this.messagesElement.nativeElement.offsetHeight +
				this.messagesElement.nativeElement.scrollTop <
			200
		) {
			this.pageIndex += 1;

			this.offset = this.pageSize * this.pageIndex - this.pageSize;

			if (this.total > this.offset) {
				this.notificationsFacadeService.loadMessages(
					this.pageSize,
					this.offset,
					this.searchText,
				);
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

		this.notificationsFacadeService.selectMessageToReply({
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

	protected searchMessagesByText($event: Event) {
		const target = $event.target as HTMLInputElement;

		this.pageIndex = 1;
		this.pageSize = 10;
		this.total = 0;
		this.offset = 0;
		this.isLoading = true;
		this.searchText = target.value;

		this.notificationsFacadeService.searchMessages(this.pageSize, this.offset, target.value);
	}
}
