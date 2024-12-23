import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';

export interface ISendFeedbackBody {
	messageId: string;
	type: ChatBotLikeTypeEnum;
	text: string | null;
}
