import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';

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
		private readonly apiService: ApiService,
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

		this.apiService
			.getUsersByFIO(searchTerm)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.searchedUsers = response.items;
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
				event.target.style.stroke = '';
				event.target.style.fillOpacity = '0';
				this.notificationService.info('Пользователь удален');
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
				this.notificationService.info('Пользователь добавлен');
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

	// Модальное окно раскрытой карточки
	public showModalOpenOut(item: any): void {
		this.modalCreateService
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: 'Информация о пользователе',
				nzNoAnimation: false,
				nzWidth: '365px',
				nzContent: ModalInfoComponent,
				nzViewContainerRef: this.viewContainerRef,
				nzData: {
					data: item,
				},
			})
			.afterClose.pipe(takeUntil(this.destroy$))
			.subscribe();
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
