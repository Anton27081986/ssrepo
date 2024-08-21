import { IFriendAccountDto } from '@app/core/models/friend-account-dto';

export interface IUserProfile {
	id: number;
	avatarUrl?: string;
	name: string;
	lastName?: string;
	firstName?: string;
	surName?: string;
	email?: string;
	department?: string;
	departmentId?: string;
	position?: string;
	phone?: string;
	birthDate?: string;
	phoneLocal?: string;
	skype?: string;
	loggedUser: IFriendAccountDto;
	isAdmin?: boolean;
	chiefName: string;
	headName: string;
	linkToCall: string;
	isIntranet: boolean;
}
