import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserStateService {



	public constructor(private readonly http: HttpClient) {}

	public getProfile(): Observable<IUserProfile> {
		return this.http.get<IUserProfile>(`${environment.apiUrl}/api/auth/Profile`);
	}
}
