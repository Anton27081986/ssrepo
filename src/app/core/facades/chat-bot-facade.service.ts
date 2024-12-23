import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChatBotApiService } from '@app/core/api/chat-bot-api.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { IChatBotMessage } from '@app/core/models/chat-bot/message';
import { ChatBotMessageTypeEnum } from '@app/core/models/chat-bot/message-type-enum';
import { ISendFeedbackBody } from '@app/core/models/chat-bot/send-feedback-body';

export enum ChatBotStates {
	Ready = 'Ready',
	MessagesLoading = 'MessagesLoading',
	Generating = 'Generating',
	Error = 'Error',
}

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ChatBotFacadeService {
	private readonly messages = new BehaviorSubject<IChatBotMessage[]>([]);
	public messages$ = this.messages.asObservable();

	private readonly subsectors = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public subsectors$ = this.subsectors.asObservable();

	private readonly activeSubsector = new BehaviorSubject<IDictionaryItemDto | null>(null);
	public activeSubsector$ = this.activeSubsector.asObservable();

	private readonly state = new BehaviorSubject<ChatBotStates>(ChatBotStates.Ready);
	public state$ = this.state.asObservable();

	private user: IUserProfile | null = null;
	private totalMessages: number = 0;

	public constructor(
		private readonly botApiService: ChatBotApiService,
		private readonly usesFacadeService: UserFacadeService,
	) {
		this.usesFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe(user => {
				this.user = user;
			});
		this.getSubsectors();
	}

	public getSubsectors(): void {
		this.botApiService
			.getSubsectors()
			.pipe(untilDestroyed(this))
			.subscribe(res => {
				this.subsectors.next(res.items);
			});
	}

	public getMessages(limit: number, offset: number): void {
		if (this.user && offset <= this.totalMessages) {
			this.state.next(ChatBotStates.MessagesLoading);
			this.botApiService
				.getMessages({
					topicId: this.user.id,
					limit,
					offset,
				})
				.pipe(untilDestroyed(this))
				.subscribe(messages => {
					this.messages.next([...this.messages.value, ...messages.items]);
					this.totalMessages = messages.total;
					this.state.next(ChatBotStates.Ready);
				});
		}
	}

	public setActiveSubsector(activeSubsector: IDictionaryItemDto | null): void {
		this.activeSubsector.next(activeSubsector);
	}

	public sendMessage(question: string | null): void {
		if (!question) {
			this.messages.next([
				{
					id: 'error',
					text: 'Введите текст запроса',
					likeType: null,
					messageType: ChatBotMessageTypeEnum.Bot,
					createdAt: '',
					topicId: '',
				},
				...this.messages.value,
			]);

			return;
		}

		if (this.activeSubsector.value && this.user) {
			this.state.next(ChatBotStates.Generating);

			this.messages.next([
				{
					id: 'error',
					text: question,
					likeType: null,
					messageType: ChatBotMessageTypeEnum.Me,
					createdAt: '',
					topicId: '',
				},
				...this.messages.value,
			]);

			this.botApiService
				.sendMessage({
					question,
					subsectorId: this.activeSubsector.value.id.toString(),
					topicId: this.user.id.toString(),
				})
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					this.messages.next([res, ...this.messages.value]);
					this.state.next(ChatBotStates.Ready);
				});
		} else {
			this.messages.next([
				{
					id: 'error',
					text: 'Выберите категорию запроса',
					likeType: null,
					messageType: ChatBotMessageTypeEnum.Bot,
					createdAt: '',
					topicId: '',
				},
				...this.messages.value,
			]);
		}
	}

	public sendFeedback(body: ISendFeedbackBody) {
		return this.botApiService.sendFeedback(body);
	}
}
