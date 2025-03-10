import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ISendMessageRequest } from '@app/core/models/notifications/send-message-request';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { IResponse } from '@app/core/utils/response';

@Injectable({
	providedIn: 'root',
})
export class NotificationsApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Получить список тем */
	public getSubjects(
		ObjectId: number,
		Query?: string,
	): Observable<Array<{ subject: string; messageCount: number }>> {
		let params = new HttpParams({ fromObject: { ObjectId } });

		if (Query) {
			params = params.append('Query', Query);
		}

		return this.http.get<Array<{ subject: string; messageCount: number }>>(
			`${environment.apiUrl}/api/notifications/messages/subjects`,
			{
				params,
			},
		);
	}

	/** Получить список сообщений */
	public getMessages(
		ObjectId: number,
		subject: string | null,
		limit?: number,
		offset?: number,
		Query?: string | undefined,
	): Observable<IResponse<IMessageItemDto>> {
		let params = new HttpParams({ fromObject: { ObjectId } });

		if (subject) {
			params = params.set('subject', subject);
		}

		if (limit) {
			params = params.set('limit', limit);
		}

		if (offset) {
			params = params.set('offset', offset);
		}

		if (Query) {
			params = params.set('Query', Query);
		}

		return this.http.get<IResponse<IMessageItemDto>>(
			`${environment.apiUrl}/api/notifications/messages`,
			{
				params,
			},
		);
	}

	/** Отправить сообщение */
	public sendMessage(body: ISendMessageRequest): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/api/notifications/messages`, body);
	}

	/** Изменить сообщение */
	public patchMessage(id: string, body: ISendMessageRequest): Observable<IMessageItemDto> {
		return this.http.put<IMessageItemDto>(
			`${environment.apiUrl}/api/notifications/messages/${id}/edit`,
			body,
		);
	}

	/** Получить список файлов */
	public getFiles(
		ObjectId: number,
		subject: string | null,
	): Observable<IResponse<IAttachmentDto>> {
		let params = new HttpParams({ fromObject: { ObjectId } });

		if (subject) {
			params = params.set('subject', subject);
		}

		return this.http.get<IResponse<IAttachmentDto>>(
			`${environment.apiUrl}/api/notifications/messages/attachments`,
			{
				params,
			},
		);
	}
}
