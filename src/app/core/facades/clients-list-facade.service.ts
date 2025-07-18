import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { IResponse } from '@app/core/utils/response';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public statusOptions = [
		{ id: 1, name: 'Новый' },
		{ id: 2, name: 'Архивный' },
		{ id: 6, name: 'Действующий' },
	];

	private readonly filtersChanged: Subject<IClientsFilter> =
		new Subject<IClientsFilter>();

	private readonly clients = new BehaviorSubject<IResponse<IClientItemDto>>(
		{} as IResponse<any>
	);

	public clients$ = this.clients.asObservable();

	private readonly categories = new BehaviorSubject<
		IResponse<{ id: number; name: string }>
	>({} as IResponse<any>);

	public categories$ = this.categories.asObservable();

	private readonly contractors = new BehaviorSubject<
		IResponse<IDictionaryItemDto>
	>({} as IResponse<any>);

	public contractors$ = this.contractors.asObservable();

	private readonly statuses = new BehaviorSubject<
		IResponse<IDictionaryItemDto>
	>({} as IResponse<any>);

	public statuses$ = this.statuses.asObservable();

	constructor(
		private readonly clientApiService: ClientApiService,
		private readonly dictionaryApiService: DictionaryApiService
	) {
		this.filtersChanged
			.pipe(
				switchMap((filter) => {
					return this.clientApiService.getClients(filter);
				}),
				tap((clients) => {
					this.clients.next(clients);
				}),
				untilDestroyed(this)
			)
			.subscribe();

		this.dictionaryApiService
			.getCategories()
			.pipe(
				tap((categories) => {
					this.categories.next(categories);
				}),
				untilDestroyed(this)
			)
			.subscribe();

		this.dictionaryApiService
			.getStatuses()
			.pipe(
				tap((statuses) => {
					this.statuses.next(statuses);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public applyFilters(filters: any) {
		this.filtersChanged.next(filters);
	}
}
