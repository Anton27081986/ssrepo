import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';

export interface ISendFeedbackBody {
	messageId: string | null;
	type: ChatBotLikeTypeEnum;
	text: string | null;
}
