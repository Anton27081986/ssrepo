import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { IUserDto } from '@app/core/models/notifications/user-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class CorrespondenceFacadeService {
	// Идентификатор объекта переписки
	private readonly objectIdSubject = new BehaviorSubject<number | null>(null);

	public objectId$ = this.objectIdSubject.asObservable();

	// Темы
	private readonly topicsSubject = new BehaviorSubject<
		Array<{ subject: string; messageCount: number }>
	>([]);

	public topics$ = this.topicsSubject.asObservable();

	// Выбранная тема
	private readonly selectedTopicSubject = new BehaviorSubject<string | null>(null);

	public selectedTopic$ = this.selectedTopicSubject.asObservable();

	// Сообщения
	private readonly messagesSubject = new BehaviorSubject<{
		items: IMessageItemDto[];
		total: number;
	}>({ items: [], total: 0 });

	public messages$ = this.messagesSubject.asObservable();

	// Файлы
	private readonly filesSubject = new BehaviorSubject<{
		items: IAttachmentDto[];
		total: number;
	} | null>(null);

	public files$ = this.filesSubject.asObservable();

	// Общее количество сообщений
	private readonly totalMessagesSubject = new BehaviorSubject<number>(0);

	public totalMessages$ = this.totalMessagesSubject.asObservable();

	// Сообщение для ответа
	private readonly repliedMessageSubject = new BehaviorSubject<{
		message: IMessageItemDto;
		toUsers: IUserDto[];
	} | null>(null);

	public repliedMessage$ = this.repliedMessageSubject.asObservable();

	// Файлы сообщения
	private readonly messageFilesSubject = new BehaviorSubject<IAttachmentDto[] | null>(null);

	public messageFiles$ = this.messageFilesSubject.asObservable();

	// Загрузка
	private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);

	public isLoading$ = this.isLoadingSubject.asObservable();

	public constructor(
		private readonly notificationsApiService: NotificationsApiService,
		private readonly filesApiService: FilesApiService,
	) {}

	public setObjectId(objectId: number | undefined) {
		if (objectId && this.objectIdSubject.value !== objectId) {
			this.objectIdSubject.next(objectId);
			this.loadSubjects();
			this.loadMessages();
			this.loadFiles();
		}
	}

	public loadSubjects(Query?: string) {
		if (this.objectIdSubject.value) {
			this.notificationsApiService
				.getSubjects(this.objectIdSubject.value, Query)
				.pipe(untilDestroyed(this))
				.subscribe(x => {
					this.topicsSubject.next(x);
				});
		}
	}

	public loadMessages(limit = 10, offset = 0, Query: string | undefined = undefined) {
		if (this.objectIdSubject.value) {
			this.notificationsApiService
				.getMessages(
					this.objectIdSubject.value,
					this.selectedTopicSubject.value,
					limit,
					offset,
					Query,
				)
				.pipe(
					tap(x => {
						this.messagesSubject.next({
							items: [...this.messagesSubject.value.items, ...x.items],
							total: x.total,
						});
					}),
					untilDestroyed(this),
				)
				.subscribe(res => {
					if (!this.selectedTopicSubject.value) {
						this.totalMessagesSubject.next(res.total);
					}
					this.isLoadingSubject.next(false);
				});
		}
	}

	public searchMessages(limit = 10, offset = 0, Query: string | undefined = undefined) {
		this.messagesSubject.next({ items: [], total: 0 });
		this.loadMessages(limit, offset, Query);
	}

	public loadFiles() {
		if (this.objectIdSubject.value) {
			this.notificationsApiService
				.getFiles(this.objectIdSubject.value, this.selectedTopicSubject.value)
				.pipe(
					tap(x => {
						this.filesSubject.next(x);
					}),
					untilDestroyed(this),
				)
				.subscribe();
		}
	}

	public selectSubject(subject: string | null) {
		this.isLoadingSubject.next(true)
		this.selectedTopicSubject.next(subject);
		this.messagesSubject.next({ items: [], total: 0 });
		this.loadMessages();
		this.loadFiles();
	}

	public setMessageVisibility(id: string, isPrivate: boolean) {
		this.messagesSubject.next({
			items: this.messagesSubject.value.items.map(message => {
				if (message.id === id) {
					return { ...message, isPrivate };
				}

				return message;
			}),
			total: this.messagesSubject.value.total,
		});
	}

	public uploadFile(file: File) {
		this.filesApiService
			.uploadFile(FileBucketsEnum.Attachments, file)
			.pipe(untilDestroyed(this))
			.subscribe(file => {
				this.messageFilesSubject.next(
					this.messageFilesSubject.value
						? [...this.messageFilesSubject.value, file]
						: [file],
				);
			});
	}

	public deleteFile(id: string) {
		this.filesApiService
			.deleteFile(id)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				if (this.messageFilesSubject.value) {
					this.messageFilesSubject.next(
						this.messageFilesSubject.value.filter(file => file.id !== id),
					);
				}
			});
	}

	public selectMessageToReply(
		replyObject: { message: IMessageItemDto; toUsers: IUserDto[] } | null,
	) {
		this.repliedMessageSubject.next(replyObject);
	}

	public sendMessage(
		subject: string,
		text: string,
		toUserIds: number[],
		copyUserIds: number[],
		isPrivate: boolean,
	) {
		if (this.objectIdSubject.value) {
			this.notificationsApiService
				.sendMessage({
					objectId: this.objectIdSubject.value,
					type: 0,
					subject,
					text,
					toUserIds,
					copyUserIds,
					isPrivate,
					replyToMessageId: this.repliedMessageSubject.value?.message.id,
					fileIds: this.messageFilesSubject.value?.map(file => file.id!) || [],
				})
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.messageFilesSubject.next(null);
					this.messagesSubject.next({ items: [], total: 0 });

					this.loadSubjects();
					this.selectSubject(subject);
				});
		}
	}
}
