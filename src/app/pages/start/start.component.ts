import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IUser} from '@auth/models/user';
import {AuthenticationService} from '@auth/services/authentication.service';
import {first} from 'rxjs';
import {UserService} from '@auth/services/user.service';
import {ThemeService} from '@app/shared/theme/theme.service';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
    loading = false;
    user: IUser;
    userFromApi?: IUser;

    constructor(
        private readonly themeService: ThemeService,
        private readonly userService: UserService,
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
                this.userFromApi = user;
            });

        // this.toggleTheme()
    }

    toggleTheme(): void {
        this.themeService.toggleTheme().then();
    }
}
