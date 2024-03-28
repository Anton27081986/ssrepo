import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@environments/environment.development';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { IResponse } from '@app/core/utils/response';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public categoriesUrl = `${environment.apiUrl}/api/company/clients/categories`;
	public contractorUrl = `${environment.apiUrl}/api/company/clients/contractors`;
	public managerUrl = `${environment.apiUrl}/api/auth/users/search`;

	public statusOptions = [
		{ id: 1, name: 'Новый' },
		{ id: 2, name: 'Архивный' },
		{ id: 5, name: 'Передан в юр.отдел' },
		{ id: 6, name: 'Активный' },
	];

	private readonly filtersChanged: Subject<IClientsFilter> = new Subject<IClientsFilter>();

	private readonly clients = new BehaviorSubject<IResponse<IClientItemDto>>({} as IResponse<any>);
	public clients$ = this.clients.asObservable();

	public constructor(private readonly clientApiService: ClientApiService) {
		this.filtersChanged
			.pipe(
				switchMap(filter => {
					return this.getClients(filter);
				}),
				tap(clients => {
					this.clients.next(clients);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getClients(filter: IClientsFilter) {
		return this.clientApiService.getClients(filter);
	}

	public applyFilters(filters: any) {
		this.filtersChanged.next(filters);
	}
}
