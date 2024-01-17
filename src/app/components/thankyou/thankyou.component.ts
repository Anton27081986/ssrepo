import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {formatDate} from "@angular/common";

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

    constructor(
        private readonly iconService: NzIconService,
        private readonly apiService: ApiService,
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
        // this.dateToday = new Date();
        this.dateToday = '07.12.2023';
        this.thankyouList = this.apiService.getPartnerThanks(this.dateToday);
    }

    onChange(result: Date): void {
        this.thankyouList = this.apiService.getPartnerThanks(formatDate(result, 'dd.MM.yyyy', 'ru-RU'));
        console.log('onChange: ', formatDate(result,'dd.MM.yyyy', 'ru-RU'));
    }
}
