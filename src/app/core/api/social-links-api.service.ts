import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class SocialLinksApiService {
	constructor(private readonly http: HttpClient) {}

	public getSocialLink(): Observable<any> {
		return this.http.get<any[]>(
			`${environment.apiUrl}/api/company/settings/favoriteLinks`,
		);
	}
}
