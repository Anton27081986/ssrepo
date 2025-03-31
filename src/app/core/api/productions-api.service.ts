import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProductionsApiService {
	constructor(private readonly http: HttpClient) {}

	public searchProductions(
		query: string,
	): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Productions`,
			{
				params: new HttpParams().set('query', query),
			},
		);
	}

	public getTgSearch(q: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/tovGroups`,
			{
				params: new HttpParams().set('query', q).set('isTg', true),
			},
		);
	}

	public getTpgSearch(q: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/tovGroups`,
			{
				params: new HttpParams().set('query', q).set('isTg', false),
			},
		);
	}

	public getSignSearch(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/tprFlags`,
		);
	}
}
