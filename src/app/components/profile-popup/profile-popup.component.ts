import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-profile-popup',
	templateUrl: './profile-popup.component.html',
	styleUrls: ['./profile-popup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopupComponent implements OnInit {
	public statusAccordion: boolean = false;
	public accountsFriends$!: Observable<any>;
	public userProfile$!: Observable<IUserProfile | null>;

	public friendsAccount!: IFriendAccountDto[] | null;

	public constructor(
		private readonly apiService: UsersApiService,
		private readonly userStateService: UserProfileStoreService,
		private readonly authenticationService: AuthenticationService,
		private readonly friendlyAccountsFacadeService: FriendlyAccountsFacadeService,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.userProfile$ = this.userStateService.userProfile$;

		this.getAccountsFriends();
		this.setFriendsAccount();

		this.accountsFriends$ = this.apiService
			.getCurrentUserFriendsAccounts()
			.pipe(map(({ items }) => items));
	}

	public setFriendsAccount() {
		this.friendlyAccountsFacadeService.setFriendsAccountsForCurrentUser();
	}

	private getAccountsFriends() {
		this.friendlyAccountsFacadeService.friendlyAccounts$
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				this.friendsAccount = item;
				this.cd.detectChanges();
			});
	}

	public logout(): void {
		this.authenticationService.logout();
		// Чтобы корректно работала темная тема, если не авторизован
		setTimeout(function () {
			window.location.reload();
		}, 0);
	}

	public enterUnderFriendlyAccount(loggedUser: any) {
		this.userStateService.resetProfile();
		this.authenticationService
			.enterUnderFriendlyAccount(loggedUser?.id, environment.apiUrl)
			.pipe(untilDestroyed(this))
			.subscribe();

		setTimeout(function () {
			window.location.reload();
		}, 200);

		this.getAccountsFriends();
	}
}
