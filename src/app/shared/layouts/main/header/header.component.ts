import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { ApiService } from '@app/core/services/api.service';
import { UserStateService } from '@app/core/states/user-state.service';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { CallPhoneService } from '@app/core/services/call-phone.service';

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

	protected readonly AppRoutes = AppRoutes;
	public constructor(
		private readonly apiService: ApiService,
		private readonly userStateService: UserStateService,
		private readonly callPhoneService: CallPhoneService,
	) {}

	public ngOnInit(): any {
		this.apiService.getFavoriteMenu().subscribe(item => {
			this.favoritemenu = item.menu;
		});

		this.apiService.getMenuListJson().subscribe(item => {
			this.listMenu = item.menu;
			this.listMenu.unshift({ link: '', name: 'Избранное', items: this.favoritemenu });
		});

		// this.profile = this.userService.loadUserProfile();

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

	public testCall() {
		debugger;
		this.callPhoneService.toggleCallForUser('test');
	}
}
