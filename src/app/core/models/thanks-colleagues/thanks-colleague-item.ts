import { IThanksColleagueUser } from '@app/core/models/thanks-colleagues/thanks-colleague-user';
import { IUserDto } from '@app/core/models/awards/user-dto';

export interface IThanksColleagueItem {
	likedUsers: IUserDto[] | null;
	/** Айди */
	id: number;
	fromUser: IThanksColleagueUser;
	toUser: IThanksColleagueUser;
	/** Текст */
	text: string | undefined;
	/** Дата создания */
	createdDate: string;
	/** Количество лайков */
	likesCount: number;
	/** Медаль и ее место если есть */
	award: number | undefined;
	/** Количество комментариев */
	commentsCount: number;
	/** Флаг что пользователь уже лайкнул */
	isUserLiked: boolean;
}
