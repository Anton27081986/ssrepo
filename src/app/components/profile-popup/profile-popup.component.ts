import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {UserStateService} from '@app/core/states/user-state.service';
import {AuthenticationService} from '@app/core/states/authentication.service';
import {map, Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {IUserProfile} from '@app/core/models/user-profile';

@Component({
    selector: 'app-profile-popup',
    templateUrl: './profile-popup.component.html',
    styleUrls: ['./profile-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopupComponent implements OnInit {
    public statusAccordion: boolean = false;
    public accountsFriends!: Observable<any>;
    public profileData!: IUserProfile[];
    public profile!: Observable<IUserProfile>;

    public constructor(
        private readonly apiService: ApiService,
        private readonly userService: UserStateService,
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

    public ngOnInit(): any {
        this.userService
            .getProfile()
            .pipe()
            .subscribe(data => {
                this.profileData = [data];
            });

        this.profile = this.userService.getProfile();
        this.accountsFriends = this.apiService.getAccounts().pipe(map(({items}) => items));
    }

    public logout(): void {
        this.authenticationService.logout();
    }

    public enterUnderFriendlyAccount(id: number) {
        this.authenticationService.enterUnderFriendlyAccount(id, environment.apiUrl).subscribe();

        setTimeout(function () {
            window.location.reload();
        }, 200);
    }
}
