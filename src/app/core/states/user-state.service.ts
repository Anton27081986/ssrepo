import { Injectable } from '@angular/core';
import { IUserProfile } from '@app/core/models/user-profile';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class UserStateService {
	private readonly userProfileSubject = new BehaviorSubject<IUserProfile | null>(null);
	public userProfile$ = this.userProfileSubject.asObservable();

	// MOVE TO KEY DICTIONARY
	private readonly userProfileKey = 'userProfile';

	public constructor(
		private readonly apiService: ApiService,
		private readonly localStorageService: LocalStorageService,
	) {
		this.restoreStateFromLocalStorage();
	}

	public restoreStateFromLocalStorage() {
		const userProfile = this.localStorageService.getItem<IUserProfile>(this.userProfileKey);

		if (userProfile) {
			this.userProfileSubject.next(userProfile);
		} else {
			console.log('user profile not found');
		}
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
