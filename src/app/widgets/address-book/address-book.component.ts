import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { AddressBookApiService } from '@app/core/api/address-book-api.service';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {AddressBookCardComponent} from "@app/widgets/address-book/address-book-card/address-book-card.component";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";

@UntilDestroy()
@Component({
	selector: 'app-address-book',
	templateUrl: './address-book.component.html',
	styleUrls: ['./address-book.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		InputComponent,
		ButtonComponent,
		IconComponent,
		SsDividerComponent,
		NgIf,
		AddressBookCardComponent,
		NgForOf,
		EmptyPlaceholderComponent,
		HeadlineComponent,
		PaginationComponent
	],
	standalone: true
})
export class AddressBookComponent implements OnInit {
	public isFavoriteMode: boolean = true;
	public loading: boolean = false;
	public idFavoriteUser: number | undefined;
	public addresses: IAddressBookUser[] = [];
	public searchedUsers: IAddressBookSearchUser[] = [];

	public pageIndex = 1;
	public pageSize = 12;
	public total: number | undefined;
	public offset = 0;

	public constructor(
		private readonly apiService: AddressBookApiService,
		private readonly usersApiService: UsersApiService,
		private readonly ref: ChangeDetectorRef,
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

	public loadSearchUsers(event: Event) {
		const searchTerm = (event.target as HTMLInputElement).value;

		if (searchTerm.trim().length) {
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
		this.clearSearch();
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
