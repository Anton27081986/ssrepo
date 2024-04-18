import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { IResponse } from '@app/core/utils/response';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class NotificationsFacadeService {
	private readonly subjectsSubject = new BehaviorSubject<
		Array<{ subject: string; messageCount: number }>
	>([]);

	public subjects$ = this.subjectsSubject.asObservable();

	private readonly messagesSubject = new BehaviorSubject<{
		items: IMessageItemDto[];
		total: number;
	} | null>(null);

	public messages$ = this.messagesSubject.asObservable();

	private readonly filesSubject = new BehaviorSubject<{
		items: IAttachmentDto[];
		total: number;
	} | null>(null);

	public files$ = this.filesSubject.asObservable();

	private readonly totalMessagesSubject = new BehaviorSubject<number>(0);

	public totalMessages$ = this.totalMessagesSubject.asObservable();

	private readonly selectedSubjectSubject = new BehaviorSubject<string | null>(null);

	public selectedSubject$ = this.selectedSubjectSubject.asObservable();

	public constructor(
		private readonly notificationsApiService: NotificationsApiService,
		private readonly filesApiService: FilesApiService,
		private readonly userProfileStoreService: UserProfileStoreService,
	) {}

	public loadSubjects(
		objectId: number,
	): Observable<Array<{ subject: string; messageCount: number }>> {
		return this.notificationsApiService.getSubjects(objectId).pipe(
			tap(x => {
				this.subjectsSubject.next(x);
				this.totalMessagesSubject.next(
					x.reduce((value, next) => {
						return value + next.messageCount;
					}, 0),
				);
			}),
			untilDestroyed(this),
		);
	}

	public loadMessages(
		ObjectId: number,
		subject?: string,
	): Observable<IResponse<IMessageItemDto>> {
		return this.notificationsApiService
			.getMessages(subject ? { ObjectId, subject } : { ObjectId })
			.pipe(
				tap(x => {
					this.messagesSubject.next(x);
					this.selectedSubjectSubject.next(subject || null);
				}),
				untilDestroyed(this),
			);
	}

	public loadFiles(ObjectId: number, subject?: string): Observable<IResponse<IAttachmentDto>> {
		return this.notificationsApiService
			.getFiles(subject ? { ObjectId, subject } : { ObjectId })
			.pipe(
				tap(x => {
					this.filesSubject.next(x);
				}),
				untilDestroyed(this),
			);
	}

	public selectSubject(subject: string) {
		this.selectedSubjectSubject.next(subject);
	}

	public uploadFile(file: File): Observable<IAttachmentDto> {
		return this.filesApiService
			.uploadFile(FileBucketsEnum.Attachments, file)
			.pipe(untilDestroyed(this));
	}

	public deleteFile(id: string): Observable<IAttachmentDto> {
		return this.filesApiService.deleteFile(id).pipe(untilDestroyed(this));
	}

	public getUserProfile() {
		return this.userProfileStoreService.userProfile$;
	}
}
