import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';
import { IUserDto } from '@app/core/models/notifications/user-dto';

@UntilDestroy()
@Component({
	selector: 'app-manager',
	templateUrl: './friendly-accounts-page.component.html',
	styleUrls: ['./friendly-accounts-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendlyAccountsPageComponent implements OnInit {
	public searchForm!: FormGroup;
	public addForm!: FormGroup;
	public submitted = false;
	public valid = false;

	protected isModalVisible = false;
	public radioValue: string = '1';

	public filterFriendsAccount: IFriendAccountDto[] | null | undefined = [];
	public friendsAccount: IFriendAccountDto[] | undefined | null;
	public friendsAccountDefault: IFriendAccountDto[] | undefined | null;

	@Input() public toUsers: IUserDto[] = [];

	public constructor(
		protected readonly friendlyAccountsFacadeService: FriendlyAccountsFacadeService,
		private readonly formBuilder: FormBuilder,
		public modal: NzModalService,
		private readonly cd: ChangeDetectorRef,
	) {
		this.friendlyAccountsFacadeService.friendlyAccounts$
			.pipe(untilDestroyed(this))
			.subscribe(accounts => {
				this.friendsAccount = accounts;
				this.friendsAccountDefault = accounts;
				this.cd.detectChanges();
			});
	}

	public ngOnInit() {
		this.addForm = this.formBuilder.group({});
		this.searchForm = this.formBuilder.group({});
	}

	public filterItems($event: any) {
		if ($event.target.value.length > 2) {
			this.filterFriendsAccount = [];

			this.friendsAccount?.forEach((element: any) => {
				if (
					(element.firstName + element.lastName + element.surName)
						.toLowerCase()
						.indexOf(String($event.target.value).toLowerCase()) !== -1
				) {
					this.filterFriendsAccount?.push(element);
				}
			});

			this.friendsAccount = [];
			this.filterFriendsAccount.forEach((element: any) => {
				this.friendsAccount?.push(element);
			});
		} else {
			this.filterFriendsAccount = [];
			this.friendsAccount = this.friendsAccountDefault;
		}
	}

	public showModal(): void {
		this.isModalVisible = true;
	}

	public postHandleOk(): void {
		if (this.addForm.valid) {
			this.submitted = false;

			this.isModalVisible = false;
		}
	}

	public handleOk(): void {
		if (this.addForm.valid) {
			this.submitted = true;

			const userList = this.toUsers.map(user => user.id!);

			this.friendlyAccountsFacadeService.addUsersInListFriendlyLogins(
				userList,
				Number(this.radioValue),
			);
		} else {
			console.error('Форма не валидна');
		}

		this.toUsers = [];
	}

	public handleCancel(): void {
		this.isModalVisible = false;
	}

	public deleteFriendlyAccount(id: number, index: number) {
		this.friendlyAccountsFacadeService.removeRelationsUsersById(id, index);
	}

	public clickByChips() {
		if (this.toUsers.length > 0) {
			this.valid = true;
		} else {
			this.valid = false;
		}
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}
}
