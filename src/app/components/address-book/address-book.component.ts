import {ChangeDetectionStrategy, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/shared/services/api/api.service';
import {Observable} from 'rxjs';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {NzModalService} from 'ng-zorro-antd/modal';

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
    public title: string = '';
    public addressBooks!: Observable<any>;

    public constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreateService: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
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
        this.addressBooks = this.apiService.getAddressBooks().pipe();

        this.searchForm = this.formBuilder.group({
            search: ['', Validators.required],
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
}
