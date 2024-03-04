import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';
import { UsersApiService } from '@app/core/api/users-api.service';

@Component({
	selector: 'app-profile-popup',
	templateUrl: './profile-popup.component.html',
	styleUrls: ['./profile-popup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopupComponent implements OnInit {
	public statusAccordion: boolean = false;
	public accountsFriends!: Observable<any>;
	public userProfile$!: Observable<IUserProfile | null>;

	public constructor(
		private readonly apiService: UsersApiService,
		private readonly userStateService: UserProfileStoreService,
		private readonly authenticationService: AuthenticationService,
	) {}

	public ngOnInit(): void {
		this.userProfile$ = this.userStateService.userProfile$;
		this.accountsFriends = this.apiService
			.getCurrentUserFriendsAccounts()
			.pipe(map(({ items }) => items));
	}

	public logout(): void {
		this.authenticationService.logout();
		// Чтобы корректно работала темная тема, если не авторизован
		setTimeout(function () {
			window.location.reload();
		}, 0);
	}

	public enterUnderFriendlyAccount(id: number) {
		this.userStateService.resetProfile();
		this.authenticationService.enterUnderFriendlyAccount(id, environment.apiUrl).subscribe();

		setTimeout(function () {
			window.location.reload();
		}, 200);

		this.accountsFriends = this.apiService
			.getCurrentUserFriendsAccounts()
			.pipe(map(({ items }) => items));
	}
}
