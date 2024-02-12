import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {IUser} from '@auth/models/user';
import {AuthenticationService} from '@app/core/states/authentication.service';
import {first} from 'rxjs';
import {UserStateService} from '@app/core/states/user-state.service';
import {ThemeService} from '@app/shared/theme/theme.service';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    loading = false;
    user: IUser;
    userFromApi?: IUser;

    constructor(
        private readonly themeService: ThemeService,
        private readonly userService: UserStateService,
        private readonly authenticationService: AuthenticationService,
    ) {
        this.user = <IUser>this.authenticationService.userValue;
    }

    ngOnInit() {
        this.loading = true;

        this.userService
            .getProfile()
            .pipe(first())
            .subscribe(user => {
                this.loading = false;
                // TODO: set user from services
                //this.userFromApi = user;
            });
    }
}
