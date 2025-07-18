import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { MainMenuStoreService } from '@app/core/states/main-menu-store.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';

@Injectable({
	providedIn: 'root',
})
export class UserFacadeService {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly menuApiService: MenuApiService,
		private readonly mainMenuStoreService: MainMenuStoreService,
		private readonly userProfileStoreService: UserProfileStoreService
	) {}

	public getUserProfile() {
		return this.userProfileStoreService.userProfile$;
	}
}
