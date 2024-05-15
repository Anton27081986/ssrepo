import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILostProductsFilter } from '@app/core/models/lost-products-filter';
import { ILostProductsItemDto } from '@app/core/models/company/lost-products-item-dto';
import { LostProductsApiService } from '@app/core/api/lost-products-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class LostProductsFacadeService {
	private readonly filtersChanged: Subject<ILostProductsFilter> =
		new Subject<ILostProductsFilter>();

	private readonly lostProducts = new BehaviorSubject<ILostProductsItemDto>({});
	public lostProducts$ = this.lostProducts.asObservable();

	public constructor(private readonly lostProductsApiService: LostProductsApiService) {
		this.filtersChanged
			.pipe(
				switchMap(filter => {
					return this.lostProductsApiService.getLostProducts(filter);
				}),
				tap(sales => {
					this.lostProducts.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: ILostProductsFilter) {
		this.filtersChanged.next(filters);
	}
}
