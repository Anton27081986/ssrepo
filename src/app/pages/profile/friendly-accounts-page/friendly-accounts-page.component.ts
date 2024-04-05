import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, tap } from 'rxjs';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { FriendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-manager',
	templateUrl: './friendly-accounts-page.component.html',
	styleUrls: ['./friendly-accounts-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendlyAccountsPageComponent implements OnInit {
	private readonly modelChangedColleague: Subject<string> = new Subject<string>();

	public isConfirmLoading = false;
	public textPlaceHolder = 'Выберите ваших коллег из списка или введите фамилию';
	public addForm!: FormGroup;
	public submitted = false;
	public valid = false;
	public selectedUser!: string;

	protected isModalVisible = false;

	public partyFriendlyAccountsSelectedTags: Array<{ name: string; id: number }> = [];

	public listColleague: Array<{ name: string; id: string }> = [];
	public radioValue: string = '1';

	public filterFriendsAccount: IFriendAccountDto[] | null | undefined = [];
	public friendsAccount: IFriendAccountDto[] | undefined | null;
	private defaultFriendsAccount: IFriendAccountDto[] | null | undefined;

	public constructor(
		private readonly friendlyAccountsFacadeService: FriendlyAccountsFacadeService,
		private readonly formBuilder: FormBuilder,
		public modal: NzModalService,
		private readonly cd: ChangeDetectorRef,
	) {
		this.friendlyAccountsFacadeService.friendlyAccounts$
			.pipe(untilDestroyed(this))
			.subscribe(accounts => {
				this.friendsAccount = accounts;
				this.defaultFriendsAccount = accounts;
				// this.cd.detectChanges();
			});
	}

	public ngOnInit() {
		this.addForm = this.formBuilder.group({});
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
			// this.filterFriendsAccount = this.defaultFriendsAccount;
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

			const userList = this.partyFriendlyAccountsSelectedTags.map(item => item.id);

			this.friendlyAccountsFacadeService.addUsersInListFriendlyLogins(
				userList,
				Number(this.radioValue),
			);
		} else {
			console.error('Форма не валидна');
		}
	}

	public handleCancel(): void {
		this.isModalVisible = false;
	}

	// При выборе клика по пользователю
	public onUserChange() {
		this.friendlyAccountsFacadeService
			.getUserByClickFromSearch(this.selectedUser)
			.pipe(
				tap(user => {
					this.partyFriendlyAccountsSelectedTags.push({
						id: user.id,
						name: user.name,
					}); // добавление тега
					// this.cd.markForCheck();

					if (this.partyFriendlyAccountsSelectedTags.length > 0) {
						this.valid = true;
					} else {
						this.valid = false;
					}
				}),
				untilDestroyed(this),
			)
			.subscribe(); // Вернуть поток
	}

	public searchUsers($event: any) {
		this.modelChangedColleague.next($event);
	}

	public deleteFriendlyAccount(id: number, index: number) {
		this.friendlyAccountsFacadeService.removeEQUsUsersById(id, index);
	}

	public deleteTagUser(i: number) {
		this.partyFriendlyAccountsSelectedTags.splice(i, 1);
		// this.cd.markForCheck();
		this.valid = false;
	}
}
