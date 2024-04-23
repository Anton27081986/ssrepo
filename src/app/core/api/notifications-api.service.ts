import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
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
	): Observable<Array<{ subject: string; messageCount: number }>> {
		return this.http.get<Array<{ subject: string; messageCount: number }>>(
			`${environment.apiUrl}/api/notifications/messages/subjects`,
			{
				params: { ObjectId },
			},
		);
	}

	/** Получить список сообщений */
	public getMessages(params: {
		ObjectId: number;
		subject?: string;
		limit?: number;
		offset?: number;
	}): Observable<IResponse<IMessageItemDto>> {
		return this.http.get<IResponse<IMessageItemDto>>(
			`${environment.apiUrl}/api/notifications/messages`,
			{
				params,
			},
		);
	}

	/** Поиск по сообщениям */
	public searchMessages(params: {
		ObjectId: number;
		query?: string;
	}): Observable<IResponse<IMessageItemDto>> {
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
	public getFiles(params: {
		ObjectId: number;
		subject?: string;
	}): Observable<IResponse<IAttachmentDto>> {
		return this.http.get<IResponse<IAttachmentDto>>(
			`${environment.apiUrl}/api/notifications/messages/attachments`,
			{
				params,
			},
		);
	}
}
