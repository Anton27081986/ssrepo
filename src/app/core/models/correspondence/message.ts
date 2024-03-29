export interface IMessage {
	id: string;
	subject: string;
	text: string;
	author: {
		id: number;
		avatarUrl: string;
		name: string;
		lastName: string;
		firstName: string;
		surName: string;
	};
	replyToMessageId: string;
	replyToMessage: string;
	attachments: any[];
	createdAt: Date;
	isPrivate: boolean;
}
