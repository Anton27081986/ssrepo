import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { IUserProfile } from '@app/core/models/user-profile';
import { environment } from '@environments/environment';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import { Router } from '@angular/router';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public userProfile$?: Observable<IUserProfile | null>;
	public profilePopup$?: Observable<boolean | null>;
	public statusBurger = false;
	public backUrl: boolean = environment.production;

	protected readonly AppRoutes = AppRoutes;
	public route: string | undefined;
	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly userStateService: UserProfileStoreService,
		public readonly _router: Router,
	) {}

	public ngOnInit(): any {
		this.listMenu$ = this.mainMenuFacade.getMainMenu();
		this.userProfile$ = this.mainMenuFacade.getUserProfile();

		this.route = String(this._router.routerState.snapshot.url);
		this.profilePopup$ = this.userStateService.windowProfile$;
	}

	protected getSearchGlobal(found: IDictionaryItemDto) {
		if (found) {
			const link = document.createElement('a');

			link.href = found.linkToDetail!;
			link.click();
		}
	}
}
