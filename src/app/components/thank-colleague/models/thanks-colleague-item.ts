import {IUserProfile} from '@app/shared/services/models/user-profile';

export interface IThanksColleagueItem {
    /** Айди */
    id?: number;
    fromUser?: IUserProfile;
    toUser?: IUserProfile;
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
