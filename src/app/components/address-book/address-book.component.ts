import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/core/services/api.service';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {IAddressBookUser} from '@app/core/models/address-book-user';
import {IAddressBookSearchUser} from '@app/core/models/address-book-search-user';
import {NzMessageService} from 'ng-zorro-antd/message';
import {tap} from 'rxjs';

@Component({
    selector: 'app-address-book',
    templateUrl: './address-book.component.html',
    styleUrls: ['./address-book.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressBookComponent implements OnInit {
    public isFavoriteMode: boolean = true;
    public searchForm!: FormGroup;
    public loading: boolean = false;
    public addresses: IAddressBookUser[] = [];
    public searchedUsers: IAddressBookSearchUser[] = [];
    public total!: number;
    public pageSize = 6;
    public pageIndex = 1;
    public offset = 0;

    public constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreateService: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly ref: ChangeDetectorRef,
        private readonly renderer: Renderer2,
        private readonly notificationService: NzMessageService,
    ) {
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
        this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
        this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
        this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
        this.iconService.addIconLiteral('ss:like', AppIcons.like);
        this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
        this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
        this.iconService.addIconLiteral('ss:medal', AppIcons.medal);
        this.iconService.addIconLiteral('ss:openOut', AppIcons.openOut);
        this.iconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
        this.iconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
        this.iconService.addIconLiteral('ss:iconClose', AppIcons.iconClose);
        this.iconService.addIconLiteral('ss:attach', AppIcons.attach);
        this.iconService.addIconLiteral('ss:favorite', AppIcons.favorite);
        this.iconService.addIconLiteral('ss:call', AppIcons.call);
    }

    public ngOnInit() {
        this.loadFavoriteUsers();

        this.searchForm = this.formBuilder.group({
            search: ['', Validators.minLength(2)],
        });
    }

    public loadFavoriteUsers() {
        this.apiService
            .getAddressBookUsers(this.offset, this.pageSize)
            .pipe(
                tap(value => {
                    this.total = value.total + this.pageSize;
                }),
            )
            .subscribe(addresses => {
                this.addresses = addresses.items;
                this.ref.markForCheck();
            });
    }

    public loadSearchUsers() {
        this.isFavoriteMode = false;
        const searchTerm = this.searchForm.get('search')?.value;

        if (!searchTerm) {
            this.searchedUsers = [];

            return;
        }

        this.apiService.getUsersByFIO(searchTerm).subscribe(response => {
            this.searchedUsers = response.items;
            this.ref.markForCheck();
        });
    }

    public get search() {
        return this.searchForm.get('search');
    }

    public clearSearch() {
        this.searchForm.get('search')?.setValue('');
    }

    public deleteFromFavorite(user: IAddressBookUser) {
        this.apiService.deleteFromAddressBook(user.id).subscribe(() => {
            this.loadFavoriteUsers();
        });
    }

    public addToFavorite(user: IAddressBookSearchUser, event: any) {
        this.apiService.addToAddressBook(user.id).subscribe(() => {
            event.target.style.stroke = 'blue';
            this.notificationService.info('Пользователь добавлен в адресную книгу');
        });
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
            .afterClose.subscribe();
    }

    nzPageIndexChange($event: number) {
        if ($event === 1) {
            this.offset = 0;
        } else {
            this.offset = this.pageSize * $event - this.pageSize;
        }

        this.pageIndex = $event; // Установка текущего индекса

        this.loadFavoriteUsers();
    }

    public toggleMode() {
        this.addresses = [];
        this.searchedUsers = [];
        this.isFavoriteMode = !this.isFavoriteMode;

        if (this.isFavoriteMode) {
            this.clearSearch();
            this.loadFavoriteUsers();
        } else {
            console.log('Грузим поиск');
        }
    }
}
