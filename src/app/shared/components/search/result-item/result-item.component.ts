import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { CallPhoneService } from '@app/core/services/call-phone.service';
import { environment } from '@environments/environment';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'ss-result-item',
	templateUrl: './result-item.component.html',
	styleUrls: ['./result-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent implements OnDestroy {
	@Input() user: any;
	@Input() call: boolean = false;

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
