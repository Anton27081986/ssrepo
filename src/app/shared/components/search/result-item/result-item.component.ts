import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CallPhoneService } from '@app/core/services/call-phone.service';
import { environment } from '@environments/environment';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
	selector: 'ss-result-item',
	templateUrl: './result-item.component.html',
	styleUrls: ['./result-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
	@Input() user: any;
	@Input() call: boolean = false;

	public constructor(
		private readonly callPhoneService: CallPhoneService,
		private readonly userStateService: UserProfileStoreService,
		private readonly authenticationService: AuthenticationService,
	) {}

	public toggleCallForUser() {
		this.callPhoneService.toggleCallForUser(this.user);
	}

	enterUnderUser(id: any) {
		this.userStateService.resetProfile();
		this.authenticationService.enterUnderFriendlyAccount(id, environment.apiUrl).subscribe();

		setTimeout(function () {
			window.location.reload();
		}, 200);
	}
}
