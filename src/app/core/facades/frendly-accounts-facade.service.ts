import { Injectable } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UsersRelationsApiService } from '@app/core/api/users-relations-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FriendlyAccountsStoreService } from '@app/core/states/friendly-accounts-store.service';
import { map, Observable, tap } from 'rxjs';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class FriendlyAccountsFacadeService {
	public friendlyAccounts$: Observable<IFriendAccountDto[] | null>;

	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly usersRelationsApiService: UsersRelationsApiService,
		private readonly friendlyAccountsStoreService: FriendlyAccountsStoreService,
	) {
		this.friendlyAccounts$ =
			this.friendlyAccountsStoreService.friendlyAccounts$;

		this.setFriendsAccountsForCurrentUser();
	}

	public setFriendsAccountsForCurrentUser() {
		this.usersApiService
			.getCurrentUserFriendsAccounts()
			.pipe(
				map(({ items }) => items),
				untilDestroyed(this),
			)
			.subscribe((accounts) => {
				this.friendlyAccountsStoreService.setFriendsAccountsForCurrentUser(
					accounts,
				);
			});
	}

	public addUsersInListFriendlyLogins(usersIds: number[], type: number) {
		this.usersRelationsApiService
			.addRelationsUsers(usersIds, type)
			.pipe(
				tap((item) => {
					this.friendlyAccountsStoreService.addFriendlyAccount(item);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public acceptAddUsersInListFriendlyLogins(
		token: string,
		isConfirm: boolean,
	) {
		this.usersRelationsApiService
			.confirmRelationsUsers(token, isConfirm)
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	public getUserForAccet(token: string) {
		return this.usersRelationsApiService
			.getRelationsUser(token)
			.pipe(untilDestroyed(this));
	}

	public removeRelationsUsersById(id: number, index: number) {
		this.friendlyAccountsStoreService.deleteFriendlyAccount(index);

		this.usersRelationsApiService
			.removeRelationsUsersById(id)
			.pipe(untilDestroyed(this))
			.subscribe();
	}
}
