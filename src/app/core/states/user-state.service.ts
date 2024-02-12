import { Injectable } from '@angular/core';
import { IUserProfile } from '@app/core/models/user-profile';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';

@Injectable({
	providedIn: 'root',
})
export class UserStateService {
	private readonly userProfileSubject = new BehaviorSubject<IUserProfile | null>(null);
	public userProfile$ = this.userProfileSubject.asObservable();

	public constructor(private readonly apiService: ApiService) {}

	public loadUserProfile(): Observable<IUserProfile> {
		return this.apiService.getProfile().pipe(
			tap(profile => {
				this.userProfileSubject.next(profile);
			}),
		);
	}
}
