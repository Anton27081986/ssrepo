import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBannersListDto } from '@app/core/models/banners/banners-list-dto';

@Injectable({
	providedIn: 'root',
})
export class BannersApiService {
	constructor(private readonly http: HttpClient) {}

	public getBanners(): Observable<IBannersListDto> {
		return this.http.get<IBannersListDto>(
			`${environment.apiUrl}/api/company/banners`,
		);
	}
}
