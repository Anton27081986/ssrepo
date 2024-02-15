import {Component, OnInit} from '@angular/core';
import {environment} from '@environments/environment';
import {Title} from '@angular/platform-browser';
import {IUser} from '@auth/models/user';
import {Store} from '@ngrx/store';
import {getCurrentUserAction} from '@auth/store/actions/get-current-user.action';
import {ProfileService} from '@app/pages/profile/profile.service';
import {ThemeService} from '@app/shared/theme/theme.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {tap} from 'rxjs';

@UntilDestroy()
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
        private readonly profileService: ProfileService,
        private readonly themeService: ThemeService,
        private readonly store: Store,
    ) {
        this.titleService.setTitle(`${environment.tabTitle} ${environment.applicationTitle}`);
    }

    ngOnInit(): void {
        console.log('environment.production', environment.production);
        console.log('environment.apiUrl', environment.apiUrl);
        console.log('environment.tabTitle', environment.tabTitle);
        console.log('environment.applicationTitle', environment.applicationTitle);

        this.store.dispatch(getCurrentUserAction());

        this.profileService
            .getTheme()
            .pipe(
                tap(value => {
                    if (value.isDarkTheme) {
                        this.themeService.setDarkTheme().then();
                    }
                }),
            )
            .subscribe();

        this.profileService.isDarkTheme$
            .pipe(
                untilDestroyed(this),
                tap(switchValue => {
                    if (switchValue) {
                        this.profileService.updateTheme(true).subscribe(_ => {
                            this.themeService.setDarkTheme().then();
                        });
                    } else {
                        this.profileService.updateTheme(false).subscribe(_ => {
                            this.themeService.setDefaultTheme().then();
                        });
                    }
                }),
            )
            .subscribe();
    }
}
