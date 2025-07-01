import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IResponseItems } from '@app/core/utils/response-items';
import { IBannerDto } from '@app/core/models/banners/banner-dto';

@Injectable({
	providedIn: 'root',
})
export class BannersApiService {
	private readonly prefix = 'cms';

	constructor(private readonly http: HttpClient) {}

	public getBanners(): Observable<IResponseItems<IBannerDto>> {
		return this.http.get<IResponseItems<IBannerDto>>(
			`${environment.apiUrl}/api/${this.prefix}/Banners`,
		);
	}
}
