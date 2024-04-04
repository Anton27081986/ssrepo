import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';

@Injectable({
	providedIn: 'root',
})
export class FrendlyAccountsStoreService {
	private readonly frendlyAccountsSubject = new BehaviorSubject<IFriendAccountDto[] | null>(null);

	public getFriendsAccountsForCurrentUser(): Observable<IFriendAccountDto[] | null> {
		return this.frendlyAccountsSubject.asObservable();
	}

	public setFriendsAccountsForCurrentUser(newfrendlyAccounts: IFriendAccountDto[]) {
		this.frendlyAccountsSubject.next(newfrendlyAccounts);
	}

	public addfrendlyAccounts(newItem: IFriendAccountDto) {
		const currentfrendlyAccounts = this.frendlyAccountsSubject.getValue();
		const frendlyAccountsItems = currentfrendlyAccounts;

		frendlyAccountsItems?.push(newItem);
		this.frendlyAccountsSubject.next(currentfrendlyAccounts);
	}

	public deleteFrendlyAccount(index: number) {
		const currentfrendlyAccounts = this.frendlyAccountsSubject.getValue();
		const frendlyAccountsItems = currentfrendlyAccounts;

		frendlyAccountsItems?.splice(index, 1);
		this.frendlyAccountsSubject.next(currentfrendlyAccounts);
	}
}
