import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { environment } from '@environments/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';

@UntilDestroy()
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public userProfile$?: Observable<IUserProfile | null>;

	public statusInputSearch = false;
	public statusInputSearchMobile = true;
	public statusBurger = false;
	public backUrl: boolean = environment.production;

	protected readonly AppRoutes = AppRoutes;
	public constructor(private readonly mainMenuFacade: MainMenuFacadeService) {}

	public ngOnInit(): any {
		this.listMenu$ = this.mainMenuFacade.getMainMenu();
		this.userProfile$ = this.mainMenuFacade.getUserProfile();
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
