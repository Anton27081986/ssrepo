import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IContractsFilter } from '@app/core/models/contracts-filter';
import { IContractsItemDto } from '@app/core/models/company/contracts-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ContractsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getContracts(filter: IContractsFilter): Observable<IContractsItemDto> {
		let params = new HttpParams();

		if (filter.clientId !== null && filter.clientId !== undefined) {
			params = params.set('clientId', filter.clientId);
		}

		if (filter.ContractorId !== null && filter.ContractorId !== undefined) {
			params = params.set('ContractorId', filter.ContractorId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		if (filter.WithArchive !== null && filter.WithArchive !== undefined) {
			params = params.set('WithArchive', filter.WithArchive);
		}

		return this.http.get<IContractsItemDto>(`${environment.apiUrl}/api/company/contracts`, {
			params,
		});
	}
}
