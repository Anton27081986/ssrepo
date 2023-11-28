import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppRoutes} from '@app/common/routes';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FooterComponent implements OnInit {
    protected readonly AppRoutes = AppRoutes;
    public listIcon!: any;

    constructor(
        private readonly apiService: ApiService,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:mail', AppIcons.mail);
    }

    ngOnInit(): any {
        this.apiService.getSocialLink().subscribe(item => {
            console.log('item.items', item.items);
            this.listIcon = item.items;
        });
    }
}
