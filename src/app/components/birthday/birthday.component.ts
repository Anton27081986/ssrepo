import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {AppIcons} from '@app/common/icons';
import {map, Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent implements OnInit {
    @ViewChild(NzCarouselComponent, {static: false}) myCarousel: NzCarouselComponent | undefined;
    public birthdayList!: Observable<any>;

    date = null;
    protected dateToday!: string;

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
        this.iconService.addIconLiteral('ss:blocknote', AppIcons.blocknote);
    }

    ngOnInit(): any {
        this.dateToday = formatDate(new Date(), 'yyyy-MM-dd', 'ru-RU');
        this.birthdayList = this.apiService.getBirthday(this.dateToday).pipe(map(({days}) => days));
    }

    onChange(result: Date): void {
        console.log('onChange: ', result);
        this.birthdayList = this.apiService
            .getBirthday(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
            .pipe(
                map(({days}) => days),
                // tap(value => console.log('value', value))
            );
    }

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
}
