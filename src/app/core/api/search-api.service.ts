import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class SearchApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Общий поиск */
	public search(title: string): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/search`, {
			params: new HttpParams().set('q', title),
		});
	}
}
