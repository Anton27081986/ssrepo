import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class SalesApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Sale */
	public getAuctions(Limit: number, Offset: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/sales/widget`, {
			params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
		});
	}
}
