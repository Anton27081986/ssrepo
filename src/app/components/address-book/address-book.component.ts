import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { AddressBookApiService } from '@app/core/api/address-book-api.service';
import { UsersApiService } from '@app/core/api/users-api.service';

@Component({
	selector: 'app-address-book',
	templateUrl: './address-book.component.html',
	styleUrls: ['./address-book.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressBookComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isFavoriteMode: boolean = true;
	public searchForm!: FormGroup;
	public loading: boolean = false;
	public idFavoriteUser: number | undefined;
	public addresses: IAddressBookUser[] = [];
	public searchedUsers: IAddressBookSearchUser[] = [];

	public constructor(
		private readonly apiService: AddressBookApiService,
		private readonly usersApiService: UsersApiService,
		private readonly formBuilder: FormBuilder,
		public modalCreateService: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly ref: ChangeDetectorRef,
		private readonly notificationService: NzMessageService,
	) {}

	public ngOnInit() {
		this.loadFavoriteUsers();

		this.searchForm = this.formBuilder.group({
			search: ['', Validators.minLength(2)],
		});
	}

	public loadFavoriteUsers() {
		this.apiService
			.getAddressBookUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe(addresses => {
				this.addresses = addresses.items;
				this.ref.detectChanges();
			});
	}

	public loadSearchUsers() {
		this.isFavoriteMode = false;
		const searchTerm = this.searchForm.get('search')?.value;

		if (!searchTerm) {
			this.searchedUsers = [];

			return;
		}

		this.usersApiService
			.getUsersByFIO(searchTerm)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.searchedUsers = response.items;
				this.searchedUsers.forEach((user, index: number) => {
					if (this.addresses.some(({ id }) => id === user.id)) {
						this.searchedUsers[index].isFavorite = 'true';
					}
				});

				this.ref.detectChanges();
			});
	}

	public get search() {
		return this.searchForm.get('search');
	}

	public clearSearch() {
		this.searchForm.get('search')?.setValue('');
	}

	public deleteFromFavorite(user: IAddressBookUser, event: any) {
		this.apiService
			.deleteFromAddressBook(user.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.loadFavoriteUsers();
				event.target.style.stroke = '#d9d9d9';
				event.target.style.fillOpacity = '0';
				this.notificationService.warning('Пользователь удален');
			});
	}

	public addToFavorite(user: IAddressBookSearchUser, event: any) {
		this.apiService
			.addToAddressBook(user.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.loadFavoriteUsers();
				event.target.style.stroke = '#4770ff';
				event.target.style.fillOpacity = '1';
				this.notificationService.success('Пользователь добавлен');
			});
	}

	public toggleFavorite(user: any, event: any) {
		this.idFavoriteUser = this.addresses.find(addresses => addresses.id === user.id)?.id;

		if (this.idFavoriteUser) {
			this.deleteFromFavorite(user, event);
		} else {
			this.addToFavorite(user, event);
		}
	}

	public toggleMode() {
		this.addresses = [];
		this.searchedUsers = [];
		this.isFavoriteMode = !this.isFavoriteMode;

		if (this.isFavoriteMode) {
			this.clearSearch();
			this.loadFavoriteUsers();
		}
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
