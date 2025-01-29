import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { MainMenuStoreService } from '@app/core/states/main-menu-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, forkJoin, map, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MainMenuFacadeService {
	public readonly aiPermission = new BehaviorSubject<boolean>(false);
	public aiPermission$ = this.aiPermission.asObservable();

	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly menuApiService: MenuApiService,
		private readonly mainMenuStoreService: MainMenuStoreService,
		private readonly userProfileStoreService: UserProfileStoreService,
		private readonly permissionsApiService: PermissionsApiService,
	) {
		this.init();
	}

	public init() {
		this.authenticationService.user$
			.pipe(
				tap(user => {
					this.permissionsApiService
						.getPermissionClient('AiAssistant')
						.pipe(untilDestroyed(this))
						.subscribe((permissions) => {
							this.aiPermission.next(permissions.items.includes('AiAssistant.Access'))
						});
				}),
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
							name: 'ИЗБРАННОЕ',
							items: favoriteMenu.menu,
						});

						return mainMenu.menu;
					}

					throw new Error('null значения');
				}),
				tap(fullMenu => {
					fullMenu.map(menu => (menu.toggle$ = new BehaviorSubject<boolean>(false)));
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

	public addFavoriteItem(item: IMenuItemDto) {
		this.menuApiService
			.addItemToFavoriteMenu(item!.id!)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.mainMenuStoreService.addFavoriteMenu(item);
			});
	}

	public deleteFavoriteItem(item: IMenuItemDto, index: number) {
		return this.menuApiService
			.deleteItemToFavoriteMenu(item!.id!)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.mainMenuStoreService.deleteFavoriteMenu(item, index);
			});
	}

	public getFavoriteItems() {
		return this.mainMenuStoreService.getFavoriteMainMenu();
	}
}
