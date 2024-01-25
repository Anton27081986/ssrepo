import {IUser} from '@app/shared/services/models/user';

export interface IThanksColleagueItem {
    /** Айди */
    id?: number;
    fromUser?: IUser;
    toUser?: IUser;
    /** Текст */
    text?: string | undefined;
    /** Дата создания */
    createdDate?: string;
    /** Количество лайков */
    likesCount?: number;
    /** Медаль и ее место если есть */
    award?: number | undefined;
    /** Количество комментариев */
    commentsCount?: number;
    /** Флаг что пользователь уже лайкнул */
    isUserLiked?: boolean;
}
