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
import { ITab } from '@app/shared/components/tabs/tab';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { AvatarComponent } from '@app/shared/components/avatar/avatar.component';
import { AsyncPipe, CommonModule, DatePipe, NgClass } from '@angular/common';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { AttachmentComponent } from '@app/shared/components/attachment/attachment.component';
import { BypassSecurityTrustHtmlPipe } from '@app/core/pipes/bypass-security-trust-html.pipe';
import { TooltipMenuComponent } from '@app/shared/components/tooltip-menu/tooltip-menu.component';
import { FileSizePipe } from '@app/core/pipes/size.pipe';

@UntilDestroy()
@Component({
	selector: 'ss-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
	imports: [
		CommonModule,
		TabsComponent,
		SearchInputComponent,
		AvatarComponent,
		AsyncPipe,
		TextComponent,
		IconComponent,
		HeadlineComponent,
		CaptionComponent,
		AttachmentComponent,
		BypassSecurityTrustHtmlPipe,
		DatePipe,
		NgClass,
		TooltipMenuComponent,
		FileSizePipe,
	],
	standalone: true,
})
export class MessagesComponent {
	protected messages$: Observable<{
		items: IMessageItemDto[];
		total: number;
	} | null>;

	protected topic$: Observable<string | null>;
	protected user$: Observable<IUserProfile | null>;
	protected files$: Observable<{
		items: IAttachmentDto[];
		total: number;
	} | null>;

	protected tabs: ITab[] = [
		{
			label: 'Все сообщения',
			name: 'messages',
			isVisible: true,
		},
		{
			label: 'Вложения',
			name: 'files',
			isVisible: true,
		},
	];

	protected messageTab: ITab | undefined = this.tabs.find(
		(x) => x.name === 'messages',
	);

	protected selectedTab: ITab | undefined = this.tabs.find(
		(x) => x.name === 'messages',
	);

	@ViewChild('messages')
	public messagesElement!: ElementRef;

	public pageIndex = 1;
	public pageSize = 10;
	public total = 0;
	public offset = 0;

	public isLoading = false;

	private searchText: string | undefined;

	constructor(
		private readonly notificationsApiService: NotificationsApiService,
		private readonly notificationsFacadeService: CorrespondenceFacadeService,
		private readonly userService: UserProfileStoreService,
	) {
		this.messages$ = this.notificationsFacadeService.messages$;
		this.files$ = this.notificationsFacadeService.files$;
		this.topic$ = this.notificationsFacadeService.selectedTopic$;
		this.user$ = this.userService.userProfile$;

		this.topic$.pipe(untilDestroyed(this)).subscribe((subject) => {
			this.selectedTab = this.tabs.find((x) => x.name === 'messages');

			const messageTab = this.tabs.find((x) => x.name === 'messages');

			messageTab!.label = subject !== null ? subject : 'Все сообщения';
			this.pageIndex = 1;
			this.pageSize = 10;
			this.total = 0;
			this.offset = 0;
			this.isLoading = true;
		});

		this.messages$.pipe(untilDestroyed(this)).subscribe((messages) => {
			this.isLoading = false;
			this.total = messages?.total || 0;

			if (this.pageIndex === 1) {
				this.scrollToBottom();
			}
		});
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

	protected scrollToBottom(): void {
		if (this.messagesElement) {
			try {
				this.messagesElement.nativeElement.scrollTop =
					this.messagesElement.nativeElement.scrollHeight;
			} catch (err) {
				console.error(err);
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
		this.selectedTab = this.tabs.find((x) => x.name === name);
	}

	protected replyTo(
		message: IMessageItemDto,
		author: IUserDto,
		toUsers: IUserDto[] = [],
	) {
		const users = [author, ...toUsers];

		this.notificationsFacadeService.selectMessageToReply({
			message,
			toUsers: users.filter(
				(user, index) =>
					index === users.findIndex((el) => user.id === el.id),
			),
		});
	}

	protected changeVisibility(message: IMessageItemDto) {
		this.notificationsApiService
			.patchMessage(message.id!, {
				...message,
				isPrivate: !message.isPrivate,
			})
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

		this.notificationsFacadeService.searchMessages(
			this.pageSize,
			this.offset,
			target.value,
		);
	}
}
