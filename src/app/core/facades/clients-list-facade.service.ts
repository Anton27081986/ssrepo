import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { map } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public constructor(private readonly clientApiService: ClientApiService) {}

	public getClients() {
		return this.clientApiService.getClients().pipe(
			map(response => {
				return response.items;
			}),
			untilDestroyed(this),
		);
	}

	public getCategoriesOptions() {}



	public applyFilters(filters: any) {}
}
