import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';
import { IMessage } from '@app/core/models/correspondence/message';
import {IMessageItemDto} from "@app/core/models/notifications/message-item-dto";

@Injectable({
	providedIn: 'root',
})
export class NotificationsStoreService implements OnDestroy {
	private readonly subjectsSubject = new BehaviorSubject<
		Array<{ subject: string; messageCount: number }>
	>([]);

	public subjects$ = this.subjectsSubject.asObservable();

	private readonly messagesSubject = new BehaviorSubject<{
		items: IMessageItemDto[];
		total: number;
	} | null>(null);

	public messages$ = this.messagesSubject.asObservable();

	private readonly totalMessagesSubject = new BehaviorSubject<number>(0);

	public totalMessages$ = this.totalMessagesSubject.asObservable();

	private readonly selectedSubjectSubject = new BehaviorSubject<string | null>(null);

	public selectedSubject$ = this.selectedSubjectSubject.asObservable();

	private readonly subscription: Subscription = new Subscription();

	public constructor(private readonly apiService: NotificationsApiService) {}

	public init(objectId: number) {
		this.subscription.add(this.loadSubjects(objectId).subscribe());
		this.subscription.add(this.loadMessages(objectId).subscribe());
	}

	public loadSubjects(
		objectId: number,
	): Observable<Array<{ subject: string; messageCount: number }>> {
		return this.apiService.getSubjects(objectId).pipe(
			tap(x => {
				this.subjectsSubject.next(x);
				this.totalMessagesSubject.next(
					x.reduce((value, next) => {
						return value + next.messageCount;
					}, 0),
				);
			}),
		);
	}

	public loadMessages(
		ObjectId: number,
		subject?: string,
	): Observable<{ items: IMessageItemDto[]; total: number }> {
		return this.apiService.getMessages(subject ? { ObjectId, subject } : { ObjectId }).pipe(
			tap(x => {
				this.messagesSubject.next(x);
				this.selectedSubjectSubject.next(subject || null);
			}),
		);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
