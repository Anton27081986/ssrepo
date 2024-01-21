import {ChangeDetectionStrategy, Component, OnInit, ViewContainerRef} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {map, Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {formatDate} from '@angular/common';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankyouComponent implements OnInit {
    public thankyouList!: Observable<any>;
    date: any;
    dateToday: any;
    private yesterday: any;

    pageSize = 6;
    pageIndex = 1;

    constructor(
        private readonly iconService: NzIconService,
        private readonly apiService: ApiService,
        public modalCreate: NzModalService,
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
    }

    ngOnInit(): any {
        this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        this.dateToday = formatDate(this.yesterday, 'yyyy-MM-dd', 'ru-RU');
        this.thankyouList = this.apiService
            .getPartnerThanks(this.dateToday)
            .pipe(map(({items}) => items.slice(0, 6)));
    }

    // Модальное окно раскрытой карточки
    showModalOpenOut(item: any): void {
        this.modalCreate
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

    onChange(result: Date): void {
        this.thankyouList = this.apiService
            .getPartnerThanks(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
            .pipe(map(({items}) => items.slice(0, 6)));
    }
}
