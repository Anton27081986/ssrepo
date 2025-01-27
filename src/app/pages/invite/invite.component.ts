import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';
import { FriendlyAccountsStoreService } from '@app/core/states/friendly-accounts-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {AsyncPipe, CommonModule, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

@Component({
	selector: 'app-invite',
	templateUrl: './invite.component.html',
	styleUrls: ['./invite.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		HeadlineComponent,
		NgIf,
		NzIconDirective,
		AsyncPipe,
		NgSwitch,
		NgSwitchCase,
		ButtonComponent
	],
	standalone: true
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
