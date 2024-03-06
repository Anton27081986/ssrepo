import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class BannersApiService {
	public constructor(private readonly http: HttpClient) {}

	public getBanners(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/company/banners`);
	}
}
