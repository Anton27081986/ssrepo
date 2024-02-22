import { Injectable } from '@angular/core';
import { IUserProfile } from '@app/core/models/user-profile';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { AuthenticationService } from '@app/core/states/authentication.service';

@Injectable({
	providedIn: 'root',
})
export class UserStateService {
	private readonly userProfileSubject = new BehaviorSubject<IUserProfile | null>(null);
	public userProfile$ = this.userProfileSubject.asObservable();

	// MOVE TO KEY DICTIONARY
	private readonly userProfileKey: string = 'userProfile';

	public constructor(
		private readonly apiService: ApiService,
		private readonly localStorageService: LocalStorageService,
		private readonly authenticationService: AuthenticationService,
	) {
		this.authenticationService.user$
			.pipe(
				tap(user => {
					if (user) {
						const userProfile = this.localStorageService.getItem<IUserProfile>(
							this.userProfileKey,
						);

						if (userProfile) {
							this.userProfileSubject.next(userProfile);
						} else {
							this.loadUserProfile().subscribe();
						}
					}
				}),
			)
			.subscribe();
	}

	public resetProfile() {
		this.localStorageService.removeItem(this.userProfileKey);
	}

	public loadUserProfile(): Observable<IUserProfile> {
		return this.apiService.getProfile().pipe(
			tap(profile => {
				this.localStorageService.setItem(this.userProfileKey, profile);
				this.userProfileSubject.next(profile);
			}),
		);
	}
}
