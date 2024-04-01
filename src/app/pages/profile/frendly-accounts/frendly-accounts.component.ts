import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, Observable, Subject, tap, zip } from 'rxjs';
import { ProfileFacadeService } from '@app/core/facades/profile-facade.service';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';
import { UsersEqusService } from '@app/core/api/users-equs.service';

@UntilDestroy()
@Component({
	selector: 'app-manager',
	templateUrl: './frendly-accounts.component.html',
	styleUrls: ['./frendly-accounts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrendlyAccountsComponent {
	public total!: number;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;

	public winsList!: Observable<any>;
	public winsUrl!: Observable<any>;
	public winsGroupsList!: Observable<any>;

	// Форма
	private readonly modelChangedColleague: Subject<string> = new Subject<string>();

	public isConfirmLoading = false;
	public textPlaceHolder = 'Выберите ваших коллег из списка или введите фамилию';
	public isSended = true;
	public addForm!: FormGroup;
	public submitted = false;

	protected isModalVisible = false;
	// public errorComment = false;

	public partyWinSelectedTags: Array<{ name: string; id: number }> = [];
	public userWinArray: string[] = [];
	public selectedUser!: string;

	public listColleague: Array<{ name: string; id: string }> = [];

	public radioValue = 1;

	public friendsAccount$!: Observable<IFriendAccountDto[] | null>;
	public filterFriendsAccount: IFriendAccountDto[] = [];
	public friendsAccount: IFriendAccountDto[] = [];

	public constructor(
		// private readonly apiService: WinsApiService,
		private readonly usersApiService: UsersApiService,
		// private readonly _victoryService: VictoryService,
		private readonly profileFacadeService: ProfileFacadeService,

		private readonly usersEqusService: UsersEqusService, // Удалить

		private readonly formBuilder: FormBuilder,
		public modal: NzModalService,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit() {
		this.addForm = this.formBuilder.group({
			// comment: ['', [Validators.required, Validators.maxLength(3000)]],
		});

		this.profileFacadeService
			.getFriendsAccountsForCurrentUser()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				console.log('item френдли', item);

				this.friendsAccount = item;

				console.log('friendsAccount френдли', this.friendsAccount);
			});

		this.friendsAccount$ = this.profileFacadeService.getFriendsAccountsForCurrentUser();

		// Подписка на изменения input поиска коллег
		zip(this.modelChangedColleague)
			.pipe(
				// debounceTime(300),
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

		// Опитимизировать два запросы

		// this.apiService
		// 	.getWins(this.pageSize, this.offset)
		// 	.pipe(
		// 		untilDestroyed(this),
		// 		map(({ total }) => total),
		// 		tap(value => {
		// 			this.total = value;
		// 		}),
		// 	)
		// 	.subscribe();

		// this.winsUrl = this.apiService.getWins(this.pageSize, this.offset);
		// this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({ items }) => items));

		// Подписка на комментарий
		// this._victoryService.count$
		// 	.pipe(
		// 		untilDestroyed(this),
		// 		tap(_ => {
		// 			this.updateWinList();
		// 		}),
		// 	)
		// 	.subscribe();
	}

	public delteteFrendlyConnect() {
		console.log('delteteFrendlyConnect');
	}

	public filterItems($event: any) {
		console.log('filterItems', $event.target.value);

		if ($event.target.value.length > 2) {
			this.filterFriendsAccount = [];
			// this.listMenu.forEach((element: any) => {
			// 	element.items.forEach((item: any) => {
			// 		if (
			// 			item.name
			// 				.toLowerCase()
			// 				.indexOf(String($event.target.value).toLowerCase()) !== -1
			// 		) {
			// 			this.filterFriendsAccount.push(item);
			// 		}
			// 	});
			// });
		} else {
			this.filterFriendsAccount = [];
		}
	}

	public addFrendlytProfile() {
		console.log('addFrendlytProfile');
	}

	// public get comment() {
	// 	return this.addForm.get('comment');
	// }

	public showModal(): void {
		this.isModalVisible = true;
	}

	public handleOk(): void {
		if (this.addForm.valid) {
			// const comment = this.comment?.value;
			const userList = this.partyWinSelectedTags.map(item => item.id);

			console.log('radioValue', this.radioValue);
			console.log('userList', userList);

			this.profileFacadeService.addUsersInListFrendlyLogins(userList, this.radioValue);

			this.usersEqusService
				.addEQUsUsers(userList, this.radioValue)
				.pipe(untilDestroyed(this))
				.subscribe(_ => {
					console.log('добавление пользователей в список дружестенных логинов');
				});

			// Создание запроса на установлении связи
			// this.apiService
			// 	.addWins(comment, userList)
			// 	.pipe(
			// 		tap(_ => {
			// 			this.partyWinSelectedTags = [];

			// 			this.updateWinList();

			// 			this.cd.detectChanges();

			// 			this.isSended = false;
			// 		}),
			// 		untilDestroyed(this),
			// 	)
			// 	.subscribe({
			// 		next: () => {
			// 			this.updateWinList();
			// 		},
			// 		error: () => {
			// 			this.errorComment = true;
			// 		},
			// 	});
		} else {
			console.error('Форма не валидна');
		}

		this.isModalVisible = false;
	}

	public handleCancel(): void {
		this.isModalVisible = false;
	}

	// При выборе клика по пользователю
	public onUserChange() {
		this.userWinArray.push(this.selectedUser); // Выбранные пользователи
		this.usersApiService
			.getUserById(this.selectedUser)
			.pipe(
				tap(user => {
					this.partyWinSelectedTags.push({
						id: user.id,
						name: user.name,
					}); // добавление тега
					this.cd.markForCheck();
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public searchUsers($event: any) {
		this.modelChangedColleague.next($event);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event; // Установка текущего индекса

		// this.updateWinList();
	}

	// Обновление списка связей
	// public updateWinList() {
	// 	this.winsList = this.apiService.getWins(this.pageSize, this.offset).pipe(
	// 		tap(_ => {
	// 			this.cd.markForCheck();
	// 		}),
	// 	);
	// }

	public deleteTagUser(i: number) {
		this.partyWinSelectedTags.splice(i, 1);
		this.cd.markForCheck();
	}
}
