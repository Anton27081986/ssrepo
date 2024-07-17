import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProductionsApiService {
	constructor(private readonly http: HttpClient) {}

	public searchProductions(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Productions`,
			{
				params: new HttpParams().set('query', query),
			},
		);
	}
}
