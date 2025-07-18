import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { environment } from '@environments/environment';
import { IFriendAccountDto } from '@app/core/models/friend-account-dto';

@Injectable({
	providedIn: 'root',
})
export class UsersRelationsApiService {
	constructor(private readonly http: HttpClient) {}

	public getRelationsTypes(): Observable<IResponse<IFriendAccountDto>> {
		return this.http.get<IResponse<IFriendAccountDto>>(
			`${environment.apiUrl}/api/auth/UsersRelations/Types`
		);
	}

	public addRelationsUsers(usersIds: number[], type: number) {
		return this.http.post(`${environment.apiUrl}/api/auth/usersRelations`, {
			usersIds,
			type,
		});
	}

	public getRelationsUser(
		token: string
	): Observable<IResponse<IFriendAccountDto>> {
		return this.http.get<IResponse<IFriendAccountDto>>(
			`${environment.apiUrl}/api/auth/UsersRelations/User`,
			{
				params: new HttpParams().set('token', token),
			}
		);
	}

	public confirmRelationsUsers(
		token: string,
		isConfirm: boolean
	): Observable<any> {
		return this.http.post<any>(
			`${environment.apiUrl}/api/auth/UsersRelations/Confirm`,
			{
				token,
				isConfirm,
			}
		);
	}

	public removeRelationsUsersById(deleteUserId: number) {
		return this.http.delete<any[]>(
			`${environment.apiUrl}/api/auth/users/friends/`,
			{
				params: new HttpParams().set('deleteUserId', deleteUserId),
			}
		);
	}
}
