import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { INewProductsFilter } from '@app/core/models/new-products-filter';
import { NewProductsApiService } from '@app/core/api/new-products-api.service';
import { INewProductsItemDto } from '@app/core/models/company/new-products-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class NewProductsFacadeService {
	private readonly filtersChanged: Subject<INewProductsFilter> =
		new Subject<INewProductsFilter>();

	private readonly newProducts = new BehaviorSubject<INewProductsItemDto>({});
	public newProducts$ = this.newProducts.asObservable();

	public constructor(private readonly newProductsApiService: NewProductsApiService) {
		this.filtersChanged
			.pipe(
				switchMap(filter => {
					return this.newProductsApiService.getNewProducts(filter);
				}),
				tap(sales => {
					this.newProducts.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: INewProductsFilter) {
		this.filtersChanged.next(filters);
	}
}
