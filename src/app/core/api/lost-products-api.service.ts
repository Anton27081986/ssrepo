import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ILostProductsFilter } from '@app/core/models/lost-products-filter';
import { ILostProductsItemDto } from '@app/core/models/company/lost-products-item-dto';

@Injectable({
	providedIn: 'root',
})
export class LostProductsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getLostProducts(filter: ILostProductsFilter): Observable<ILostProductsItemDto> {
		let params = new HttpParams();

		if (filter.clientId !== null && filter.clientId !== undefined) {
			params = params.set('ClientId', filter.clientId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<ILostProductsItemDto>(
			`${environment.apiUrl}/api/company/lostProducts`,
			{
				params,
			},
		);
	}
}
