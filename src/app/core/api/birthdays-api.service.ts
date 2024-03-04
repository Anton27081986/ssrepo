import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BirthdaysApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Birthday */
	public getBirthday(date: string): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/birthdays`, {
			params: new HttpParams().set('date', date),
		});
	}
}
