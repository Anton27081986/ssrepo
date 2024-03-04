import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { environment } from '@environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class AddressBookApiService {
	public constructor(private readonly http: HttpClient) {}

	public getAddressBookUsers(): Observable<IResponse<IAddressBookUser>> {
		return this.http.get<IResponse<IAddressBookUser>>(
			`${environment.apiUrl}/api/auth/AddressBook`,
			{
				params: new HttpParams(),
			},
		);
	}

	public addToAddressBook(userId: number): Observable<any> {
		return this.http.post(`${environment.apiUrl}/api/auth/AddressBook/${userId}`, { userId });
	}

	public deleteFromAddressBook(userId: number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}/api/auth/AddressBook/${userId}`);
	}
}
