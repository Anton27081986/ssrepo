import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {UserService} from '@auth/services/user.service';
import {AuthenticationService} from '@auth/services/authentication.service';

@Component({
    selector: 'app-profile-popup',
    templateUrl: './profile-popup.component.html',
    styleUrls: ['./profile-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopupComponent {
    public statusAccordion = false;
    // public profileData!: Observable<any>;
    public profile!: any;

    constructor(
        private readonly apiService: ApiService,
        private readonly userService: UserService,
        private readonly iconService: NzIconService,
        private readonly authenticationService: AuthenticationService,
    ) {
        this.iconService.addIconLiteral('ss:exit', AppIcons.exit);
        this.iconService.addIconLiteral('ss:arrowRight', AppIcons.arrowRight);

        this.iconService.addIconLiteral('ss:arrowRight', AppIcons.arrowRight);

        this.iconService.addIconLiteral('ss:settings', AppIcons.settings);
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:enter', AppIcons.enter);
    }

    ngOnInit(): any {
        this.userService
            .getProfile()
            .pipe()
            .subscribe(data => {
                this.profile = data;
            });

        // this.profileData = this.userService.getProfile();
    }

    logout(): void {
        this.authenticationService.logout();
    }
}
