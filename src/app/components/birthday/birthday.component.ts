import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {AppIcons} from '@app/common/icons';
import {map} from 'rxjs';
import {ApiService} from '@app/core/services/api.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {formatDate} from '@angular/common';
import {IBirthday} from '@app/core/models/birthday';

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent implements OnInit {
    @ViewChild(NzCarouselComponent, {static: false}) myCarousel: NzCarouselComponent | undefined;

    date = null;
    birthdays: IBirthday[] = [];
    selectedTabIndex = 1;
    protected dateToday!: string;

    constructor(
        private readonly iconService: NzIconService,
        private readonly apiService: ApiService,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly ref: ChangeDetectorRef,
    ) {
        // TODO: move to icon registration service
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
        // TODO : make unsubscribe
        this.apiService
            .getBirthday(this.dateToday)
            .pipe(map(({days}) => days))
            .subscribe(result => {
                this.birthdays = result;
                this.selectTabByDay(new Date().toLocaleDateString());
                this.ref.markForCheck();
            });
    }

    onChange(result: Date): void {
        const selectedDate = result.toLocaleDateString();

        // TODO : make unsubscribe
        this.apiService
            .getBirthday(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
            .pipe(map(({days}) => days))
            .subscribe(birthdays => {
                this.birthdays = birthdays;
                this.selectTabByDay(selectedDate);
                this.ref.markForCheck();
            });
    }

    showModalOpenOut(item: any): void {
        this.modalCreate
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

    selectTabByDay(date: string) {
        this.selectedTabIndex = this.birthdays.findIndex(x => x.name === date);
    }
}
