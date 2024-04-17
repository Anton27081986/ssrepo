import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';

@Injectable({
	providedIn: 'root',
})
export class SaleRequestsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getSaleRequests(filter: ISaleRequestsFilter): Observable<ISaleRequestsDto> {
		let params = new HttpParams();

		if (filter.ContractorId) {
			params = params.set('ContractorId', filter.ContractorId);
		}

		if (filter.FromShipDate) {
			params = params.set('FromShipDate', new Date(filter.FromShipDate).toISOString());
		}

		if (filter.ToShipDate) {
			params = params.set('ToShipDate', new Date(filter.ToShipDate).toISOString());
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<ISaleRequestsDto>(`${environment.apiUrl}/api/company/SaleRequests`, {
			params,
		});
	}
}
