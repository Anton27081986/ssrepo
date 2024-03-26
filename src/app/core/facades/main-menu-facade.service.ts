import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { MainMenuStoreService } from '@app/core/states/main-menu-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, forkJoin, map, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MainMenuFacadeService {
	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly menuApiService: MenuApiService,
		private readonly mainMenuStoreService: MainMenuStoreService,
		private readonly userProfileStoreService: UserProfileStoreService,
	) {
		this.init();
	}

	public init() {
		this.authenticationService.user$
			.pipe(
				filter(x => x !== null),
				switchMap(() => {
					const favoriteMenu$ = this.menuApiService.getFavoriteMenu();
					const mainMenu$ = this.menuApiService.getMenu();

					return forkJoin([favoriteMenu$, mainMenu$]);
				}),
				map(([favoriteMenu, mainMenu]) => {
					if (mainMenu && mainMenu.menu) {
						// Temp solution, while links not be changed
						mainMenu.menu![0].items![5].link = './clients-list';

						mainMenu.menu.unshift({
							link: '',
							name: 'Избранное',
							items: favoriteMenu.menu,
						});

						return mainMenu.menu;
					}

					throw new Error('null значения');
				}),
				tap(fullMenu => {
					this.mainMenuStoreService.setMainMenu(fullMenu);
				}),
				untilDestroyed(this),
			)
			.subscribe({
				error: (error: unknown) => {
					console.error('Ошибка получения данных меню', error);
				},
			});
	}

	public getMainMenu() {
		return this.mainMenuStoreService.getMainMenu();
	}

	public getUserProfile() {
		return this.userProfileStoreService.userProfile$;
	}
}
