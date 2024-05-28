import { IUserDto } from '@app/core/models/notifications/user-dto';
import { IChangeItemDto } from '@app/core/models/change-tracker/change-item-dto';

export interface IChangeTrackerItemDto {
	id: number;
	createdTime: string;
	user: IUserDto;
	changes: IChangeItemDto[];
	comments?: string;
	action: string;
}
