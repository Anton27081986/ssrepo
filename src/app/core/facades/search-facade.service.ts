import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { map } from 'rxjs';
import { UsersApiService } from '@app/core/api/users-api.service';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { ProductionsApiService } from '@app/core/api/productions-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SearchFacadeService {
	private clientId: number | null | undefined;

	public constructor(
		private readonly clientApiService: ClientApiService,
		private readonly usersApiService: UsersApiService,
		private readonly dictionaryApiService: DictionaryApiService,
		public readonly clientCardListFacade: ClientsCardFacadeService,
		public readonly productionsApiService: ProductionsApiService,
	) {
		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			this.clientId = clientId;
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

	public getClients(query: string, onlyActive: boolean = false) {
		return this.clientApiService.getClientsDictionary(query, onlyActive);
	}

	public getProductions(query: string) {
		return this.productionsApiService.searchProductions(query);
	}

	public getContractor(query: string) {
		return this.dictionaryApiService.getContractors(query, this.clientId);
	}

	public getTovs(query?: string) {
		return this.dictionaryApiService.getTovs(query).pipe(map(response => response.items));
	}

	public getTechnologist(query?: string) {
		return this.dictionaryApiService
			.getTechnologist(this.clientId!, query)
			.pipe(map(response => response.items));
	}

	public getClientIdDictionary(id: number) {
		return this.clientApiService.getClientIdDictionary(id);
	}
}
