import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { AddressBookApiService } from '@app/core/api/address-book-api.service';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-address-book',
	templateUrl: './address-book.component.html',
	styleUrls: ['./address-book.component.scss'],
})
export class AddressBookComponent implements OnInit {
	public isFavoriteMode: boolean = true;
	public loading: boolean = false;
	public idFavoriteUser: number | undefined;
	public addresses: IAddressBookUser[] = [];
	public searchedUsers: IAddressBookSearchUser[] = [];

	public pageIndex = 1;
	public pageSize = 10;
	public total: number | undefined;
	public offset = 0;

	public constructor(
		private readonly apiService: AddressBookApiService,
		private readonly usersApiService: UsersApiService,
		private readonly ref: ChangeDetectorRef
	) {}

	public ngOnInit() {
		this.loadFavoriteUsers();
	}

	public loadFavoriteUsers() {
		this.apiService
			.getAddressBookUsers(this.pageSize, this.offset)
			.pipe(untilDestroyed(this))
			.subscribe(addresses => {
				this.addresses = addresses.items.map(user => {
					return { ...user, isFavorite: true };
				});
				this.total = addresses.total;
				this.ref.detectChanges();
			});
	}

	public loadSearchUsers(event?: Event) {
		if (event) {
			const searchTerm = (event.target as HTMLInputElement).value;

			this.isFavoriteMode = false;

			this.usersApiService
				.getUsersByFIO(searchTerm)
				.pipe(untilDestroyed(this))
				.subscribe(response => {
					this.searchedUsers = response.items;
					this.searchedUsers.forEach((user, index: number) => {
						if (this.addresses.some(({ id }) => id === user.id)) {
							this.searchedUsers[index].isFavorite = true;
						}
					});
					this.ref.detectChanges();
				});
		}
	}

	public clearSearch() {
		this.searchedUsers = [];
		this.isFavoriteMode = true;
		this.loadFavoriteUsers();
	}

	public toggleFavorite(user: IAddressBookSearchUser) {
		if (!user.isFavorite) {
			this.apiService
				.addToAddressBook(user.id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					user.isFavorite = true;
					this.ref.detectChanges();
				});
		} else {
			this.apiService
				.deleteFromAddressBook(user.id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					user.isFavorite = false;
					this.ref.detectChanges();
				});
		}
	}

	public toggleMode() {
		this.isFavoriteMode = !this.isFavoriteMode;
		this.total = 0;

		if (this.isFavoriteMode) {
			this.clearSearch();
		}
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event; // Установка текущего индекса

		this.loadFavoriteUsers();
	}
}
