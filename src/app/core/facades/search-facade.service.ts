import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@environments/environment.development';
import { UsersApiService } from '@app/core/api/users-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SearchFacadeService {
	public contractorUrl = `${environment.apiUrl}/api/company/dictionary/contractors`;

	public constructor(
		private readonly httpClient: HttpClient,
		private readonly clientApiService: ClientApiService,
		private readonly usersApiService: UsersApiService,
	) {}

	public getUsers(query: string) {
		return this.usersApiService.getUsersByFIO(query);
	}

	public getRegions(query: string) {
		return this.clientApiService.getRegions(query);
	}

	public getSubSectors(query: string) {
		return this.clientApiService.getSubSectors(query);
	}

	public getClients(query: string) {
		return this.clientApiService.getClientsDictionary(query);
	}

	public getContractor(query: string, clientId?: number) {
		if (query) {
			return this.httpClient
				.get<IResponse<IDictionaryItemDto>>(this.contractorUrl, {
					params: new HttpParams().set('query', query).set('clientId', clientId!),
				})
				.pipe(map(response => response.items));
		}

		return this.httpClient
			.get<IResponse<IDictionaryItemDto>>(this.contractorUrl)
			.pipe(map(response => response.items));
	}
}
