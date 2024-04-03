import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, Observable, Subject, tap, zip } from 'rxjs';
import { FrendlyAccountsFacadeService } from '@app/core/facades/frendly-accounts-facade.service';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { FrendlyAccountsStoreService } from '@app/core/states/frendly-accounts-store.service';

@UntilDestroy()
@Component({
	selector: 'app-manager',
	templateUrl: './frendly-accounts.component.html',
	styleUrls: ['./frendly-accounts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrendlyAccountsComponent {
	private readonly modelChangedColleague: Subject<string> = new Subject<string>();

	public isConfirmLoading = false;
	public textPlaceHolder = 'Выберите ваших коллег из списка или введите фамилию';
	public isSended = true;
	public addForm!: FormGroup;
	public submitted = false;
	public valid = false;

	protected isModalVisible = false;

	public partyFrendlyAccountsSelectedTags: Array<{ name: string; id: number }> = [];
	public selectedUser!: string;

	public listColleague: Array<{ name: string; id: string }> = [];
	public radioValue: string = '1';

	public friendsAccount$!: Observable<IFriendAccountDto[] | null>;
	public filterFriendsAccount: IFriendAccountDto[] = [];
	public friendsAccount: any;

	public constructor(
		private readonly usersApiService: UsersApiService,
		private readonly frendlyAccountsFacadeService: FrendlyAccountsFacadeService,
		private readonly frendlyAccountsStoreService: FrendlyAccountsStoreService,

		private readonly formBuilder: FormBuilder,
		public modal: NzModalService,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit() {
		this.addForm = this.formBuilder.group({});

		this.setFriendsAccount();
		this.getFriendsAccount();

		// Подписка на изменения input поиска коллег
		zip(this.modelChangedColleague)
			.pipe(
				tap(value => {
					if (value[0].length > 1) {
						this.usersApiService
							.getUsersByFIO(value[0])
							.pipe(
								map(({ items }) => items),
								tap(data => {
									this.listColleague = data;
								}),
								untilDestroyed(this),
							)
							.subscribe();
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public setFriendsAccount() {
		this.frendlyAccountsFacadeService.setFriendsAccountsForCurrentUser();
	}

	public getFriendsAccount() {
		this.frendlyAccountsFacadeService
			.getFriendsAccountsForCurrentUser()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				this.friendsAccount = item;
				this.cd.detectChanges();
			});
	}

	public filterItems($event: any) {
		if ($event.target.value.length > 2) {
			this.filterFriendsAccount = [];

			this.friendsAccount.forEach((element: any) => {
				if (
					(element.firstName + element.lastName + element.surName)
						.toLowerCase()
						.indexOf(String($event.target.value).toLowerCase()) !== -1
				) {
					this.filterFriendsAccount.push(element);
				}
			});

			this.friendsAccount = [];
			this.filterFriendsAccount.forEach((element: any) => {
				this.friendsAccount.push(element);
			});
		} else {
			this.filterFriendsAccount = [];
			this.setFriendsAccount();
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

			const userList = this.partyFrendlyAccountsSelectedTags.map(item => item.id);

			this.frendlyAccountsFacadeService.addUsersInListFrendlyLogins(
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
		this.usersApiService
			.getUserById(this.selectedUser)
			.pipe(
				tap(user => {
					this.partyFrendlyAccountsSelectedTags.push({
						id: user.id,
						name: user.name,
					}); // добавление тега
					this.cd.markForCheck();

					if (this.partyFrendlyAccountsSelectedTags.length > 0) {
						this.valid = true;
					} else {
						this.valid = false;
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public searchUsers($event: any) {
		this.modelChangedColleague.next($event);
	}

	public deleteFrendlyAccount(id: number, index: number) {
		this.frendlyAccountsFacadeService.removeEQUsUsersById(id, index);
	}

	public deleteTagUser(i: number) {
		this.partyFrendlyAccountsSelectedTags.splice(i, 1);
		this.cd.markForCheck();
		this.valid = false;
	}
}
