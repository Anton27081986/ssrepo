import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankyouComponent {
    public thankyouList!: Observable<any>;
    date = null;

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
        this.thankyouList = this.apiService.getPartnerThanks();
    }

    onChange(result: Date): void {
        console.log('onChange: ', result);
    }
}
