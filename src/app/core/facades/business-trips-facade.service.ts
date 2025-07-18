import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILostProductsFilter } from '@app/core/models/lost-products-filter';
import { ILostProductsItemDto } from '@app/core/models/company/lost-products-item-dto';
import { IBusinessTripsFilter } from '@app/core/models/business-trips-filter';
import { BusinessTripsApiService } from '@app/core/api/business-trips-api.service';
import { IResponse } from '@app/core/utils/response';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class BusinessTripsFacadeService {
	private readonly filtersChanged: Subject<IBusinessTripsFilter> =
		new Subject<ILostProductsFilter>();

	private readonly businessTrips = new BehaviorSubject<
		IResponse<IBusinessTripsDto>
	>({
		items: [],
		total: 0,
		linkToModule: '',
	});

	public businessTrips$ = this.businessTrips.asObservable();

	constructor(
		private readonly businessTripsApiService: BusinessTripsApiService
	) {
		this.filtersChanged
			.pipe(
				switchMap((filter) => {
					return this.businessTripsApiService.getBusinessTrips(
						filter
					);
				}),
				tap((trips) => {
					this.businessTrips.next(trips);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public applyFilters(filters: IBusinessTripsFilter) {
		this.filtersChanged.next(filters);
	}
}
