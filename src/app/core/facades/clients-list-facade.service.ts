import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { map, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError } from 'rxjs/operators';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsListFacadeService {
	public categoriesOptions: IDictionaryItemDto[] = [];

	private readonly clientInputChanged: Subject<string> = new Subject<string>();
	public clientOptions: IDictionaryItemDto[] = [];

	private readonly contractorInputChanged: Subject<string> = new Subject<string>();
	public contractorOptions: IDictionaryItemDto[] = [];

	public statusOptions = [
		{ id: 1, name: 'Новый' },
		{ id: 2, name: 'Архивный' },
		{ id: 5, name: 'Фиксированый' },
		{ id: 6, name: 'Активный' },
	];

	public constructor(private readonly clientApiService: ClientApiService) {
		// this.initCategoriesFilter();
		this.loadCategoriesOptions();
	}

	public getClients() {
		return this.clientApiService.getClients().pipe(
			map(response => {
				return response.items;
			}),
			untilDestroyed(this),
		);
	}

	public applyFilters(filters: any) {}

	// private initCategoriesFilter() {
	// 	this.categoryInputChanged
	// 		.pipe(
	// 			debounceTime(300),
	// 			filter(value => value.length >= 1),
	// 			switchMap(value =>
	// 				this.clientApiService.getCategories(value).pipe(
	// 					catchError((error: unknown) => {
	// 						console.error('Ошибка при получении данных', error);
	//
	// 						return [];
	// 					}),
	// 				),
	// 			),
	// 			tap(options => {
	// 				console.log(options);
	// 				this.categoriesOptions = options;
	// 			}),
	// 			untilDestroyed(this),
	// 		)
	// 		.subscribe();
	// }

	private loadCategoriesOptions() {
		this.clientApiService
			.getCategories()
			.pipe(
				tap(categories => {
					this.categoriesOptions = categories;
				}),
				catchError((error: unknown) => {
					console.error('Ошибка при получении данных', error);

					return [];
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
