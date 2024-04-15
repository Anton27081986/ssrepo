import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@environments/environment.development';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SearchFacadeService {
	public contractorUrl = `${environment.apiUrl}/api/company/dictionary/contractors`;

	constructor(
		private readonly httpClient: HttpClient,
		private readonly clientApiService: ClientApiService,
	) {}

	public getRegions(query: string) {
		return this.clientApiService.getRegions(query);
	}

	public getSubSectors(query: string) {
		return this.clientApiService.getSubSectors(query);
	}

	public getContractor(query: string) {
		if (query) {
			return this.httpClient
				.get<IResponse<IDictionaryItemDto>>(this.contractorUrl!, {
					params: new HttpParams().set('query', query),
				})
				.pipe(map(response => response.items));
		}

		return this.httpClient
			.get<IResponse<IDictionaryItemDto>>(this.contractorUrl!)
			.pipe(map(response => response.items));
	}
}
