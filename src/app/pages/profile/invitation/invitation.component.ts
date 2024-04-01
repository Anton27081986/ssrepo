import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileFacadeService } from '@app/core/facades/profile-facade.service';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

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

	constructor(private readonly profileFacadeService: ProfileFacadeService) {}

	ngOnInit(): void {
		this.friendsAccount$ = this.profileFacadeService.getUserForAccet(
			'e644009e-68f9-4927-8e3d-7fe23e1a8e52',
		);
	}

	public acceptAddUser(token: string) {
		this.acceptClick = true;
		// this.profileFacadeService.acceptAddUsersInListFrendlyLogins(token, true);
	}

	public cancelAddUser(token: string) {
		this.cancelClick = true;
		// this.profileFacadeService.acceptAddUsersInListFrendlyLogins(token, false);
	}
}
