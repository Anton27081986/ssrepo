import {Component, OnInit} from '@angular/core';
import {environment} from '@environments/environment';
import {Title} from '@angular/platform-browser';
import {AuthenticationService} from '@auth/services/authentication.service';
import {IUser} from '@auth/models/user';
import {Role} from '@auth/models/role';
import {Store} from '@ngrx/store';
import {ProfileService} from '@app/pages/profile/profile.service';
import {ThemeService} from '@app/shared/theme/theme.service';
import {UntilDestroy} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title!: string;
    user?: IUser | null;

    constructor(
        private readonly titleService: Title,
        private readonly profileService: ProfileService,
        private readonly themeService: ThemeService,
        private readonly authenticationService: AuthenticationService,
        private readonly store: Store,
    ) {
        this.titleService.setTitle(`${environment.tabTitle} ${environment.applicationTitle}`);
    }


    get isAdmin() {
        return this.user?.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
    }
}
