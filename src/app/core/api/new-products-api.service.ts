import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { INewProductsFilter } from '@app/core/models/new-products-filter';
import { INewProductsItemDto } from '@app/core/models/company/new-products-item-dto';

@Injectable({
	providedIn: 'root',
})
export class NewProductsApiService {
	constructor(private readonly http: HttpClient) {}

	public getNewProducts(
		filter: INewProductsFilter,
	): Observable<INewProductsItemDto> {
		let params = new HttpParams();

		if (filter.СlientId !== null && filter.СlientId !== undefined) {
			params = params.set('ClientId', filter.СlientId);
		}

		if (filter.customerId !== null && filter.customerId !== undefined) {
			params = params.set('customerId', filter.customerId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<INewProductsItemDto>(
			`${environment.apiUrl}/api/company/newProducts`,
			{
				params,
			},
		);
	}
}
