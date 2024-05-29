import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@environments/environment.development';
import { UsersApiService } from '@app/core/api/users-api.service';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SearchFacadeService {
	public contractorUrl = `${environment.apiUrl}/api/company/dictionary/contractors`;
	private clientId: number | undefined;

	public constructor(
		private readonly httpClient: HttpClient,
		private readonly clientApiService: ClientApiService,
		private readonly usersApiService: UsersApiService,
		private readonly dictionaryApiService: DictionaryApiService,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
		this.clientCardListFacade.client$.pipe(untilDestroyed(this)).subscribe(client => {
			if (client.id) {
				this.clientId = client.id;
			}
		});
	}

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

	public getContractor(query: string) {
		return this.dictionaryApiService.getContractors(query, this.clientId);
	}

	public getTovs(query?: string) {
		return this.dictionaryApiService.getTovs(query).pipe(map(response => response.items));
	}

	public getTechnologist(query?: string) {
		return this.dictionaryApiService
			.getTechnologist(query)
			.pipe(map(response => response.items));
	}
}
