import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IMessage } from '@app/core/models/correspondence/message';

@Injectable({
	providedIn: 'root',
})
export class NotificationsApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Получить список тем */
	public getSubjects(ObjectId: string): Observable<string[]> {
		return this.http.get<string[]>(
			`${environment.apiUrl}/api/notifications/messages/subjects`,
			{
				params: { ObjectId },
			},
		);
	}

	/** Получить список сообщений */
	public getMessages(ObjectId: string): Observable<{ items: IMessage[]; total: number }> {
		return this.http.get<{ items: IMessage[]; total: number }>(
			`${environment.apiUrl}/api/notifications/messages`,
			{
				params: { ObjectId },
			},
		);
	}
}
