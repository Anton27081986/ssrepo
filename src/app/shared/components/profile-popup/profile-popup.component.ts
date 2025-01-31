import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ProfilePopupImports } from "@app/shared/components/profile-popup/profile-popup.imports";

@UntilDestroy()
@Component({
	selector: 'app-profile-popup',
	templateUrl: './profile-popup.component.html',
	styleUrls: ['./profile-popup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: ProfilePopupImports,
	standalone: true
})
export class ProfilePopupComponent implements OnInit, OnDestroy {
	public accountsFriends$!: Observable<any>;
	public userProfile$!: Observable<IUserProfile | null>;

	public friendsAccount!: IFriendAccountDto[] | null;

	private readonly destroy$ = new Subject<void>();
	public isExpanded: boolean = false;

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

	public enterUnderFriendlyAccount(loggedUser: IFriendAccountDto) {
		if (loggedUser.id) {
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

	public AuthUser(user: IDictionaryItemDto) {
		if (user.id) {
			this.userStateService.resetProfile();
			this.authenticationService
				.enterUnderFriendlyAccount(user.id, environment.apiUrl)
				.pipe(takeUntil(this.destroy$))
				.subscribe();

			setTimeout(function () {
				window.location.reload();
			}, 200);
		}
	}

	public ngOnDestroy() {
		this.destroy$.complete();
	}
}
