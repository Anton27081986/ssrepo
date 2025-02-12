import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IBusinessTripsFilter } from '@app/core/models/business-trips-filter';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { IResponse } from '@app/core/utils/response';

@Injectable({
	providedIn: 'root',
})
export class BusinessTripsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getBusinessTrips(
		filter: IBusinessTripsFilter,
	): Observable<IResponse<IBusinessTripsDto>> {
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

		return this.http.get<IResponse<IBusinessTripsDto>>(
			`${environment.apiUrl}/api/company/Trips`,
			{
				params,
			},
		);
	}
}
