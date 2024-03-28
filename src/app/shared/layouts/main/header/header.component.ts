import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { environment } from '@environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { MainMenuStoreService } from '@app/core/states/main-menu-store.service';
import { switchMap } from 'rxjs/operators';
import { MenuApiService } from '@app/core/api/menu-api.service';

@UntilDestroy()
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public listMenu: any; // IMenuItemDto[] // Временно
	public userProfile$?: Observable<IUserProfile | null>;

	public statusInputSearch = false;
	public statusInputSearchMobile = true;
	public statusBurger = false;
	public backUrl: boolean = environment.production;

	protected readonly AppRoutes = AppRoutes;
	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,

		private readonly mainMenuStoreService: MainMenuStoreService,
		private readonly apiService: MenuApiService,
	) {}

	public ngOnInit(): any {
		this.listMenu$ = this.mainMenuFacade.getMainMenu();
		this.userProfile$ = this.mainMenuFacade.getUserProfile();

		// Переписать
		this.listMenu$.pipe(untilDestroyed(this)).subscribe(item => {
			this.listMenu = item;
		});

		// Переписать
		this.mainMenuStoreService.menu$
			.pipe(
				untilDestroyed(this),
				switchMap(_ => {
					return this.apiService.getFavoriteMenu();
				}),
			)
			.subscribe(item => {
				this.listMenu[0].items = item.menu;
			});
	}

	public openSearch(event: Event) {
		event.stopPropagation();
		this.statusInputSearch = !this.statusInputSearch;
	}

	public openSearchMobile(event: Event) {
		event.stopPropagation();
		this.statusInputSearchMobile = !this.statusInputSearchMobile;
	}

	public menuToggle(event: Event) {
		event.stopPropagation();
		this.statusBurger = !this.statusBurger;
	}
}
