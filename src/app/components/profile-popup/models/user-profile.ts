import { IFriendAccountDto } from '@app/components/profile-popup/models/friend-account-dto';

export interface IUserProfile {
	id: number;
	avatarUrl?: string;
	name?: string;
	lastName?: string;
	firstName?: string;
	surName?: string;
	email?: string;
	department?: string;
	position?: string;
	phone?: string;
	birthDate?: string;
	phoneLocal?: string;
	skype?: string;
	loggedUser: IFriendAccountDto;
}
