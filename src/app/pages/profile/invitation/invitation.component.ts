import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendlyAccountsStoreService } from '@app/core/states/friendly-accounts-store.service';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-invitation',
	templateUrl: './invitation.component.html',
	styleUrls: ['./invitation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationComponent implements OnInit {
	public acceptClick: boolean = false;
	public cancelClick: boolean = false;

	public friendsAccount$!: Observable<any>;

	private tokenAccept!: string;

	constructor(
		private readonly profileFacadeService: FriendlyAccountsFacadeService,
		private readonly friendlyAccountsStoreService: FriendlyAccountsStoreService,
		private readonly activateRoute: ActivatedRoute,
		private readonly router: Router,
	) {}

	ngOnInit(): void {
		this.tokenAccept = this.activateRoute.snapshot.queryParams.token;

		if (!this.tokenAccept) {
			this.router.navigate(['/']);
		}

		this.friendsAccount$ = this.profileFacadeService.getUserForAccet(this.tokenAccept);
	}

	public acceptAddUser() {
		this.acceptClick = true;
		this.profileFacadeService.acceptAddUsersInListFriendlyLogins(this.tokenAccept, true);

		this.friendsAccount$.pipe(untilDestroyed(this)).subscribe(item => {
			this.friendlyAccountsStoreService.addFriendlyAccount(item);
		});
	}

	public cancelAddUser() {
		this.cancelClick = true;
		this.profileFacadeService.acceptAddUsersInListFriendlyLogins(this.tokenAccept, false);
	}
}
