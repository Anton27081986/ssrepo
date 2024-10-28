import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IUserProfile } from '@app/core/models/user-profile';
import { IResponse } from '@app/core/utils/response';
import { IFriendAccountDto } from '@app/core/models/auth/friend-account-dto';

@Injectable({
	providedIn: 'root',
})
export class UsersApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Поиск пользователей по ФИО */
	public getUsersByFIO(title: string): Observable<any> {
		return this.http.get<any>(`${environment.apiUrl}/api/auth/users/search`, {
			params: new HttpParams().set('query', title),
		});
	}

	/** Получить прочие настройки пользователя */
	public getSettings(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/company/settings`);
	}

	public getCurrentUserFriendsAccounts() {
		return this.http.get<IResponse<IFriendAccountDto>>(
			`${environment.apiUrl}/api/auth/users/friends`,
		);
	}

	/** Получение пользователя по id */
	public getUserById(id: number): Observable<IUserProfile> {
		return this.http.get<IUserProfile>(`${environment.apiUrl}/api/auth/users/${id}`);
	}

	public getListLikedUsers(id: number, type: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/likes/${id}`, {
			params: new HttpParams().set('Type', type),
		});
	}

	/** Получить профиль текущего пользователя */
	public getProfile(): Observable<IUserProfile> {
		return this.http.get<IUserProfile>(`${environment.apiUrl}/api/auth/Profile`);
	}
}
