import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppRoutes} from '@app/common/routes';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    protected readonly AppRoutes = AppRoutes;

    constructor(private readonly iconService: NzIconService) {
        this.iconService.addIconLiteral('ss:mail', AppIcons.mail);
    }
}
