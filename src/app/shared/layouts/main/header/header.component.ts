import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { environment } from '@environments/environment';
import { MenuApiService } from '@app/core/api/menu-api.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
	public statusInputSearch = false;
	public statusInputSearchMobile = true;
	public statusBurger = false;
	public listMenu!: any; // IMainMenu[]
	public profile!: Observable<any>;
	public favoritemenu!: any; // IMainMenu[]
	public userProfile$?: Observable<IUserProfile | null>;
	public backUrl: boolean = environment.production;

	protected readonly AppRoutes = AppRoutes;
	public constructor(
		private readonly apiService: MenuApiService,
		private readonly userStateService: UserProfileStoreService,
	) {}

	public ngOnInit(): any {
		this.apiService.getFavoriteMenu().subscribe(item => {
			this.favoritemenu = item.menu;
		});

		this.apiService.getMenuListJson().subscribe(item => {
			this.listMenu = item.menu;
			this.listMenu.unshift({ link: '', name: 'Избранное', items: this.favoritemenu });
		});

		this.userProfile$ = this.userStateService.userProfile$;
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
