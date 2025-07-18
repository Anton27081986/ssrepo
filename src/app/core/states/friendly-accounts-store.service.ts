import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';

@Injectable({
	providedIn: 'root',
})
export class FriendlyAccountsStoreService {
	private readonly friendly = new BehaviorSubject<IFriendAccountDto[] | null>(
		null
	);

	public friendlyAccounts$ = this.friendly.asObservable();

	public setFriendsAccountsForCurrentUser(
		newFriendlyAccounts: IFriendAccountDto[]
	) {
		this.friendly.next(newFriendlyAccounts);
	}

	public addFriendlyAccount(newAccount: IFriendAccountDto) {
		const currentFriendlyAccounts = this.friendly.getValue();

		if (newAccount.id) {
			currentFriendlyAccounts?.push(newAccount);
			this.friendly.next(currentFriendlyAccounts);
		}
	}

	public deleteFriendlyAccount(index: number) {
		const currentFriendlyAccounts = this.friendly.getValue();

		currentFriendlyAccounts?.splice(index, 1);
		this.friendly.next(currentFriendlyAccounts);
	}
}
