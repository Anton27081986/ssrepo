import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';
import { ChatBotMessageTypeEnum } from '@app/core/models/chat-bot/message-type-enum';

export interface IChatBotMessage {
	id: string | null;
	text: string;
	topicId: string;
	createdAt: string;
	likeType: ChatBotLikeTypeEnum | null;
	messageType: ChatBotMessageTypeEnum;
}
