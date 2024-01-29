import {Component, OnInit} from '@angular/core';
import {environment} from '@environments/environment';
import {Title} from '@angular/platform-browser';
import {AuthenticationService} from '@auth/services/authentication.service';
import {IUser} from '@auth/models/user';
import {Role} from '@auth/models/role';
import {Store} from '@ngrx/store';
import {getCurrentUserAction} from '@auth/store/actions/get-current-user.action';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title!: string;
    user?: IUser | null;

    constructor(
        private readonly titleService: Title,
        private readonly authenticationService: AuthenticationService,
        private readonly store: Store,
    ) {
        this.titleService.setTitle(`${environment.tabTitle} ${environment.applicationTitle}`);
    }

    ngOnInit(): void {
        this.store.dispatch(getCurrentUserAction());
    }

    get isAdmin() {
        return this.user?.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
    }
}
