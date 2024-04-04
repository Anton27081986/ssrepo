import { Injectable } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UsersEqusService } from '@app/core/api/users-equs.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FrendlyAccountsStoreService } from '@app/core/states/frendly-accounts-store.service';
import { map } from 'rxjs';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class FrendlyAccountsFacadeService {
	constructor(
		private readonly apiService: UsersApiService,
		private readonly usersEqusService: UsersEqusService,
		private readonly frendlyAccountsStoreService: FrendlyAccountsStoreService,
	) {}

	public getFriendsAccountsForCurrentUser() {
		return this.frendlyAccountsStoreService.getFriendsAccountsForCurrentUser();
	}

	public setFriendsAccountsForCurrentUser() {
		this.apiService
			.getCurrentUserFriendsAccounts()
			.pipe(
				map(({ items }) => items),
				untilDestroyed(this),
			)
			.subscribe(item => {
				this.frendlyAccountsStoreService.setFriendsAccountsForCurrentUser(item);
			});
	}

	public addUsersInListFrendlyLogins(usersIds: number[], type: number) {
		this.usersEqusService.addEQUsUsers(usersIds, type).pipe(untilDestroyed(this)).subscribe();
	}

	public acceptAddUsersInListFrendlyLogins(token: string, isConfirm: boolean) {
		this.usersEqusService
			.сonfirmEQUsUsers(token, isConfirm)
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	public getUserForAccet(token: string) {
		return this.usersEqusService.getEQUUser(token).pipe(untilDestroyed(this));
	}

	public removeEQUsUsersById(id: number, index: number) {
		this.frendlyAccountsStoreService.deleteFrendlyAccount(index);

		this.usersEqusService.removeEQUsUsersById(id).pipe(untilDestroyed(this)).subscribe();
	}
}
