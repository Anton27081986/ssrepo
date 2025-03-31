import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IReturnRequestsItemDto } from '@app/core/models/company/return-requests-item-dto';
import { ReturnRequestsApiService } from '@app/core/api/return-requests-api.service';
import { IReturnRequestsFilter } from '@app/core/models/return-requests-filter';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ReturnRequestsFacadeService {
	private readonly filtersChanged: Subject<IReturnRequestsFilter> =
		new Subject<IReturnRequestsFilter>();

	private readonly requests = new BehaviorSubject<IReturnRequestsItemDto>({});
	public requests$ = this.requests.asObservable();

	constructor(
		private readonly returnRequestsApiService: ReturnRequestsApiService,
	) {
		this.filtersChanged
			.pipe(
				switchMap((filter) => {
					return this.returnRequestsApiService.getReturnRequests(
						filter,
					);
				}),
				tap((sales) => {
					this.requests.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: IReturnRequestsFilter) {
		this.filtersChanged.next(filters);
	}
}
