import {IBirthdayUser} from '@app/core/models/birthday-user';

export interface IBirthday {
    items: IBirthdayUser[];
    name: string;
}
