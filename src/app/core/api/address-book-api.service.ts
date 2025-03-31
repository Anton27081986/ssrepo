import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AddressBookApiService {
	constructor(private readonly http: HttpClient) {}

	public getAddressBookUsers(
		limit: number,
		offset: number,
	): Observable<IResponse<IAddressBookUser>> {
		let params = new HttpParams();

		if (limit !== null && limit !== undefined) {
			params = params.set('Limit', limit);
		}

		if (offset !== null && offset !== undefined) {
			params = params.set('Offset', offset);
		}

		return this.http.get<IResponse<IAddressBookUser>>(
			`${environment.apiUrl}/api/auth/AddressBook`,
			{
				params,
			},
		);
	}

	public addToAddressBook(userId: number): Observable<any> {
		return this.http.post(
			`${environment.apiUrl}/api/auth/AddressBook/${userId}`,
			{ userId },
		);
	}

	public deleteFromAddressBook(userId: number): Observable<any> {
		return this.http.delete(
			`${environment.apiUrl}/api/auth/AddressBook/${userId}`,
		);
	}
}
