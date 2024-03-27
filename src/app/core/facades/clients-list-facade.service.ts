import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { map, Subject, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@environments/environment.development';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public categoriesUrl = `${environment.apiUrl}/api/company/clients/categories`;
	public contractorUrl = `${environment.apiUrl}/api/company/clients/contractors`;
	public clientUrl = `${environment.apiUrl}/api/auth/users/search`;
	public managerUrl = `${environment.apiUrl}/api/auth/users/search`;

	public statusOptions = [
		{ id: 1, name: 'Новый' },
		{ id: 2, name: 'Архивный' },
		{ id: 5, name: 'Передан в юр.отдел' },
		{ id: 6, name: 'Активный' },
	];

	private readonly filtersChanged: Subject<any> = new Subject<any>();

	public constructor(private readonly clientApiService: ClientApiService) {
		this.filtersChanged
			.pipe(
				switchMap(filter => {
					return this.getClients(filter);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getClients(filter: any) {
		return this.clientApiService.getClients().pipe(
			map(response => {
				return response.items;
			}),
		);
	}

	public applyFilters(filters: any) {
		this.filtersChanged.next(filters);
	}
}
