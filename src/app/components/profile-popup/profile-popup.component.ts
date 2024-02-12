import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { UserStateService } from '@app/core/states/user-state.service';
import { AuthenticationService } from '@app/core/states/authentication.service';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';

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
		private readonly apiService: ApiService,
		private readonly userStateService: UserStateService,
		private readonly authenticationService: AuthenticationService,
	) {}

	public ngOnInit(): void {
		this.userProfile$ = this.userStateService.userProfile$;
		this.accountsFriends = this.apiService.getAccounts().pipe(map(({ items }) => items));
	}

	public logout(): void {
		this.authenticationService.logout();
	}

	public enterUnderFriendlyAccount(id: number) {
		this.authenticationService.enterUnderFriendlyAccount(id, environment.apiUrl).subscribe();

		setTimeout(function () {
			window.location.reload();
		}, 200);
	}
}
