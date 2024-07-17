import { Injectable } from '@angular/core';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';

@Injectable()
export class ClientProposalsService {
	// заготовка для табов в аккордионе
	constructor(private readonly clientProposalsApiService: ClientProposalsApiService) {}

	public getModelClientData(clientId: number) {
		return this.clientProposalsApiService.getModelClientData(clientId);
	}
}
