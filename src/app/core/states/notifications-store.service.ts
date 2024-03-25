import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';
import { IMessage } from '@app/core/models/correspondence/message';

@Injectable({
	providedIn: 'root',
})
export class NotificationsStoreService implements OnDestroy {
	private readonly subjectsSubject = new BehaviorSubject<string[]>([]);
	public subjects$ = this.subjectsSubject.asObservable();

	private readonly messagesSubject = new BehaviorSubject<{
		items: IMessage[];
		total: number;
	} | null>(null);

	public messages$ = this.messagesSubject.asObservable();

	private readonly subscription: Subscription = new Subscription();

	public constructor(private readonly apiService: NotificationsApiService) {}

	public init(objectId: string) {
		this.subscription.add(this.loadSubjects(objectId).subscribe());
		this.subscription.add(this.loadMessages(objectId).subscribe());
	}

	public loadSubjects(objectId: string): Observable<any> {
		return this.apiService.getSubjects(objectId).pipe(
			tap(x => {
				this.subjectsSubject.next(x);
			}),
		);
	}

	public loadMessages(objectId: string): Observable<{ items: IMessage[]; total: number }> {
		return this.apiService.getMessages(objectId).pipe(
			tap(x => {
				this.messagesSubject.next(x);
			}),
		);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
