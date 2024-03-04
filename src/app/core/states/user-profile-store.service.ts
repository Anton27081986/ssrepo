import { Injectable, OnDestroy } from '@angular/core';
import { IUserProfile } from '@app/core/models/user-profile';
import { BehaviorSubject, filter, Observable, Subscription, tap } from 'rxjs';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { AuthenticationService } from '@app/core/states/authentication.service';
import { switchMap } from 'rxjs/operators';
import { UsersApiService } from '@app/core/api/users-api.service';

@Injectable({
	providedIn: 'root',
})
export class UserProfileStoreService implements OnDestroy {
	private readonly userProfileSubject = new BehaviorSubject<IUserProfile | null>(null);
	public userProfile$ = this.userProfileSubject.asObservable();
	private readonly userProfileKey: string = 'userProfile';
	private readonly subscription: Subscription = new Subscription();

	public constructor(
		private readonly apiService: UsersApiService,
		private readonly localStorageService: LocalStorageService,
		private readonly authenticationService: AuthenticationService,
	) {
		this.init();
	}

	private init(): void {
		const sub = this.authenticationService.user$
			.pipe(
				filter(user => !!user),
				switchMap(() => {
					const userProfile = this.localStorageService.getItem<IUserProfile>(
						this.userProfileKey,
					);

					if (userProfile) {
						this.userProfileSubject.next(userProfile);

						return [];
					}

					return this.loadUserProfile();
				}),
			)
			.subscribe();

		this.subscription.add(sub);
	}

	public resetProfile() {
		this.localStorageService.removeItem(this.userProfileKey);
		this.userProfileSubject.next(null);
	}

	public loadUserProfile(): Observable<IUserProfile> {
		return this.apiService.getProfile().pipe(
			tap(profile => {
				this.localStorageService.setItem(this.userProfileKey, profile);
				this.userProfileSubject.next(profile);
			}),
		);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
