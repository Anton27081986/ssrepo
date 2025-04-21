import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleRequestsApiService } from '@app/core/api/sale-requests-api.service';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SaleRequestsFacadeService {
	private readonly filtersChanged: Subject<ISaleRequestsFilter> =
		new Subject<ISaleRequestsFilter>();

	private readonly sales = new BehaviorSubject<ISaleRequestsDto>({});
	public sales$ = this.sales.asObservable();

	constructor(private readonly salesApiService: SaleRequestsApiService) {
		this.filtersChanged
			.pipe(
				switchMap((filter) => {
					return this.salesApiService.getSaleRequests(filter);
				}),
				tap((sales) => {
					this.sales.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: ISaleRequestsFilter) {
		this.filtersChanged.next(filters);
	}
}
