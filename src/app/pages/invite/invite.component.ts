import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';
import { FriendlyAccountsStoreService } from '@app/core/states/friendly-accounts-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
	selector: 'app-invite',
	templateUrl: './invite.component.html',
	styleUrls: ['./invite.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteComponent implements OnInit {
	public acceptClick: boolean = false;
	public cancelClick: boolean = false;

	public friendsAccount$!: Observable<any>;

	private tokenAccept!: string;

	public constructor(
		private readonly profileFacadeService: FriendlyAccountsFacadeService,
		private readonly friendlyAccountsStoreService: FriendlyAccountsStoreService,
		private readonly activateRoute: ActivatedRoute,
		private readonly router: Router,
	) {}

	public ngOnInit(): void {
		this.tokenAccept = this.activateRoute.snapshot.queryParams.token;

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
