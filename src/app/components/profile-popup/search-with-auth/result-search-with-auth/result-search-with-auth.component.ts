import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CallPhoneService } from '@app/core/services/call-phone.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { environment } from '@environments/environment';

@Component({
	selector: 'ss-result-search-with-auth',
	templateUrl: './result-search-with-auth.component.html',
	styleUrls: ['./result-search-with-auth.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultSearchWithAuthComponent implements OnDestroy {
	@Input() public user: any;
	@Input() public call: boolean = false;

	private readonly destroy$ = new Subject<void>();

	public constructor(
		private readonly callPhoneService: CallPhoneService,
		private readonly userStateService: UserProfileStoreService,
		private readonly authenticationService: AuthenticationService,
	) {}

	public toggleCallForUser() {
		this.callPhoneService.toggleCallForUser(this.user);
	}

	public enterUnderUser(id: any) {
		this.userStateService.resetProfile();
		this.authenticationService
			.enterUnderFriendlyAccount(id, environment.apiUrl)
			.pipe(takeUntil(this.destroy$))
			.subscribe();

		setTimeout(function () {
			window.location.reload();
		}, 200);
	}

	public ngOnDestroy() {
		this.destroy$.complete();
	}
}
