import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IReturnRequestsFilter } from '@app/core/models/return-requests-filter';
import { IReturnRequestsItemDto } from '@app/core/models/company/return-requests-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ReturnRequestsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getReturnRequests(filter: IReturnRequestsFilter): Observable<IReturnRequestsItemDto> {
		let params = new HttpParams();

		if (filter.clientId !== null && filter.clientId !== undefined) {
			params = params.set('clientId', filter.clientId);
		}

		if (filter.contractorId !== null && filter.contractorId !== undefined) {
			params = params.set('contractorId', filter.contractorId);
		}

		if (filter.authorId !== null && filter.authorId !== undefined) {
			params = params.set('authorId', filter.authorId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<IReturnRequestsItemDto>(
			`${environment.apiUrl}/api/company/returnRequests`,
			{
				params,
			},
		);
	}
}
