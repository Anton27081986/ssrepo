import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';

@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public constructor(private readonly clientApiService: ClientApiService) {}

	public getClients() {
		return this.clientApiService.getClients();
	}

	public getFilters() {}
}
