import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';

@Component({
    selector: 'app-profile-popup',
    templateUrl: './profile-popup.component.html',
    styleUrls: ['./profile-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopupComponent {
    constructor(
        private readonly apiService: ApiService,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:exit', AppIcons.exit);
        this.iconService.addIconLiteral('ss:settings', AppIcons.settings);
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
    }
}
