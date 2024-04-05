import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { environment } from '@environments/environment.development';
import { IFriendAccountDto } from '@app/core/models/friend-account-dto';

@Injectable({
	providedIn: 'root',
})
export class UsersRelationsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getEQUsTypes(): Observable<IResponse<IFriendAccountDto>> {
		return this.http.get<IResponse<IFriendAccountDto>>(
			`${environment.apiUrl}/api/auth/usersEQUs/getEQUsTypes`,
		);
	}

	public addEQUsUsers(usersIds: number[], type: number) {
		return this.http.post(`${environment.apiUrl}/api/auth/usersEQUs/addEQUsUsers`, {
			usersIds,
			type,
		});
	}

	public getEQUUser(token: string): Observable<IResponse<IFriendAccountDto>> {
		return this.http.get<IResponse<IFriendAccountDto>>(
			`${environment.apiUrl}/api/auth/usersEQUs/getEQUUser`,
			{
				params: new HttpParams().set('token', token),
			},
		);
	}

	public сonfirmEQUsUsers(token: string, isConfirm: boolean): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/api/auth/usersEQUs/сonfirmEQUsUsers`, {
			token,
			isConfirm,
		});
	}

	public removeEQUsUsersById(deleteUserId: number) {
		return this.http.delete<any[]>(`${environment.apiUrl}/api/auth/users/friends/`, {
			params: new HttpParams().set('deleteUserId', deleteUserId),
		});
	}
}
