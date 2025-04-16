import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';

@Injectable({
	providedIn: 'root',
})
export class SaleRequestsApiService {
	constructor(private readonly http: HttpClient) {}

	public getSaleRequests(
		filter: ISaleRequestsFilter,
	): Observable<ISaleRequestsDto> {
		let params = new HttpParams();

		if (filter.ContractorId) {
			params = params.set('ContractorId', filter.ContractorId);
		}

		if (filter.clientId) {
			params = params.set('ClientId', filter.clientId);
		}

		if (filter.FromShipDate) {
			params = params.set('FromShipDate', filter.FromShipDate);
		}

		if (filter.ToShipDate) {
			params = params.set('ToShipDate', filter.ToShipDate);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		if (
			filter.WithPaymentOverdue !== null &&
			filter.WithPaymentOverdue !== undefined
		) {
			params = params.set(
				'WithPaymentOverdue',
				filter.WithPaymentOverdue,
			);
		}

		return this.http.get<ISaleRequestsDto>(
			`${environment.apiUrl}/api/company/SaleRequests`,
			{
				params,
			},
		);
	}
}
