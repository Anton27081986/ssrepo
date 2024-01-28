import {IAddressBookUser} from '@app/components/address-book/models/address-book-user';

export interface IAddressBookUsersRequest {
    items: IAddressBookUser[];
    total: number;
}
