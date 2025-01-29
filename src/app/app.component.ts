import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUser } from '@auth/models/user';
import { ProfileService } from '@app/pages/profile/profile.service';
import { ThemeService } from '@app/shared/theme/theme.service';
import { tap } from 'rxjs';
import { IconsService } from '@app/core/services/icons.service';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		trigger('routeAnimations', [
			transition('* <=> *', [
				// Скрываем новый экран до начала анимации
				query(':enter', [style({ opacity: 0 })], { optional: true }),
				// Анимируем уходящий экран
				query(':leave', [animate('500ms', style({ opacity: 0 }))], { optional: true }),
				// Анимируем входящий экран
				query(':enter', [animate('500ms', style({ opacity: 1 }))], { optional: true }),
			]),
		]),
	],
})
export class AppComponent implements OnInit {
	public title!: string;
	public user?: IUser | null;

	public constructor(
		private readonly titleService: Title,
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
		private readonly iconsService: IconsService,
	) {
		this.titleService.setTitle(`${environment.tabTitle} ${environment.applicationTitle}`);
	}

	public prepareRoute(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}

	public ngOnInit(): void {
		this.profileService.isDarkTheme$
			.pipe(
				tap(switchValue => {
					if (switchValue) {
						this.profileService
							.updateTheme(true)
							.pipe(untilDestroyed(this))
							.subscribe(_ => {
								this.themeService.setDarkTheme().then();
							});
					} else {
						this.profileService
							.updateTheme(false)
							.pipe(untilDestroyed(this))
							.subscribe(_ => {
								this.themeService.setDefaultTheme().then();
							});
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
