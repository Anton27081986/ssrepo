import { Injectable } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { map } from 'rxjs';
import { UsersEqusService } from '@app/core/api/users-equs.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ProfileFacadeService {
	constructor(
		private readonly apiService: UsersApiService,
		private readonly usersEqusService: UsersEqusService,
	) {}

	public getFriendsAccountsForCurrentUser() {
		return this.apiService.getCurrentUserFriendsAccounts().pipe(map(({ items }) => items));
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
}
