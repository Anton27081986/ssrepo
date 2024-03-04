import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ThanksPartnerApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Спасибо партнеру */
	public getPartnerThanks(date: any): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/partnerThanks?date=${date}`, {
			// params: new HttpParams().set('date', '04.12.2023'),
		});
	}
}
