import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IRequestSamplesFilter } from '@app/core/models/request-samples-filter';
import { ISampleItemDto } from '@app/core/models/company/sample-item-dto';

@Injectable({
	providedIn: 'root',
})
export class RequestSamplesApiService {
	constructor(private readonly http: HttpClient) {}

	public getRequestSamples(
		filter: IRequestSamplesFilter
	): Observable<ISampleItemDto> {
		let params = new HttpParams();

		if (filter.clientId !== null && filter.clientId !== undefined) {
			params = params.set('ClientId', filter.clientId);
		}

		if (filter.TovId !== null && filter.TovId !== undefined) {
			params = params.set('TovId', filter.TovId);
		}

		if (filter.managerId !== null && filter.managerId !== undefined) {
			params = params.set('ManagerId', filter.managerId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<ISampleItemDto>(
			`${environment.apiUrl}/api/company/RequestSamples`,
			{
				params,
			}
		);
	}
}
