import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IGetMessagesParams } from '@app/core/models/chat-bot/get-messages-params';
import { IResponse } from '@app/core/utils/response';
import { IChatBotMessage } from '@app/core/models/chat-bot/message';
import { ISendMessageBody } from '@app/core/models/chat-bot/send-message-body';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {ISendFeedbackBody} from "@app/core/models/chat-bot/send-feedback-body";

@Injectable({
	providedIn: 'root',
})
export class ChatBotApiService {
	public constructor(private readonly http: HttpClient) {}

	public getMessages(params: IGetMessagesParams): Observable<IResponse<IChatBotMessage>> {
		return this.http.get<IResponse<IChatBotMessage>>(
			`${environment.apiUrl}/api/ai-assistant/messages`,
			{
				params: new HttpParams()
					.set('TopicId', params.topicId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getSubsectors(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/ai-assistant/messages/subsectors`,
		);
	}

	public sendMessage(body: ISendMessageBody): Observable<IChatBotMessage> {
		return this.http.post<IChatBotMessage>(
			`${environment.apiUrl}/api/ai-assistant/messages`,
			body,
		);
	}

	public sendFeedback(body: ISendFeedbackBody): Observable<IChatBotMessage> {
		return this.http.post<IChatBotMessage>(
			`${environment.apiUrl}/api/ai-assistant/messages/reaction`,
			body,
		);
	}
}
