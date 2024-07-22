import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { IUserProfile } from '@app/core/models/user-profile';
import { environment } from '@environments/environment';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import { Router } from '@angular/router';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';

@Component({
	selector: 'app-new-header',
	templateUrl: './new-header.component.html',
	styleUrls: ['./new-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewHeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public userProfile$?: Observable<IUserProfile | null>;
	public profilePopup$?: Observable<boolean | null>;

	public statusInputSearch = false;
	public statusInputSearchMobile = true;
	public statusBurger = false;
	public backUrl: boolean = environment.production;

	protected readonly AppRoutes = AppRoutes;
	public route: string | undefined;
	public profilePopup: boolean | undefined;
	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly userStateService: UserProfileStoreService,
		public readonly router: Router,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit(): any {
		this.listMenu$ = this.mainMenuFacade.getMainMenu();
		this.userProfile$ = this.mainMenuFacade.getUserProfile();

		this.route = String(this.router.routerState.snapshot.url);
		this.profilePopup$ = this.userStateService.windowProfile$;
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

	public toggleProfilePopup(event: Event) {
		event.stopPropagation();

		this.profilePopup = this.userStateService.getStateWindow();

		if (!this.profilePopup) {
			this.userStateService.setStateWindow(true);
			this.profilePopup = !this.profilePopup;
		} else {
			this.userStateService.setStateWindow(false);
			this.profilePopup = false;
		}
	}
}
