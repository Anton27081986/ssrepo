import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/shared/services/api/api.service';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {IAddressBookUser} from '@app/components/address-book/models/address-book-user';

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
    public searchTerm: string = '';

    public constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreateService: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly ref: ChangeDetectorRef,
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
            search: ['', Validators.required],
        });
    }

    public loadFavoriteUsers() {
        this.apiService
            .getAddressBookUsers()
            .pipe()
            .subscribe(addresses => {
                this.addresses = addresses.items;
                this.ref.markForCheck();
            });
    }

    public loadSearchUsers() {
        let searchTerm = this.searchForm.get('search')?.value;

        console.log(searchTerm);

        if (!searchTerm) {
            searchTerm = '';
        }

        this.apiService.getUsersByFIO(searchTerm).subscribe(response => {
            console.log(response);
        });
    }

    public get search() {
        return this.searchForm.get('search');
    }

    public clearSearch() {
        this.searchForm.get('search')?.setValue('');
    }

    public deleteFromFavorite(user: IAddressBookUser) {
        console.log(user);
        this.apiService.deleteFromAddressBook(user.id).subscribe(() => {
            console.log('пользователь удалён из адресной книги');
            this.loadFavoriteUsers();
        });
    }

    // Модальное окно раскрытой карточки
    public showModalOpenOut(item: any): void {
        this.modalCreateService
            .create({
                nzClosable: false,
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

    public toggleMode() {
        console.log('toggle');
        this.isFavoriteMode = !this.isFavoriteMode;

        if (this.isFavoriteMode) {
            this.loadFavoriteUsers();
        } else {
            // this.loadSearchUsers();
            console.log('Грузим поиск');
        }
    }
}
