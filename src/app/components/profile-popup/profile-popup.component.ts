import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {UserService} from '@auth/services/user.service';
import {AuthenticationService} from '@auth/services/authentication.service';
import {map, Observable} from 'rxjs';
import {environment} from '@environments/environment';

@Component({
    selector: 'app-profile-popup',
    templateUrl: './profile-popup.component.html',
    styleUrls: ['./profile-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfilePopupComponent implements OnInit {
    statusAccordion = false;
    accountsFriends!: Observable<any>;
    profileData!: any;
    profile!: Observable<any>;

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
                this.profileData = [data];
            });

        this.profile = this.userService.getProfile();
        this.accountsFriends = this.apiService.getAccounts().pipe(map(({items}) => items));
    }

    logout(): void {
        this.authenticationService.logout();
    }

    enterUnderFriendlyAccount(id: number) {
        this.authenticationService.enterUnderFriendlyAccount(id, environment.apiUrl).subscribe();

        setTimeout(function () {
            window.location.reload();
        }, 200);
    }
}
