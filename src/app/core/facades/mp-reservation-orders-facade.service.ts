import {Injectable} from '@angular/core';
import {MpReservationOrdersApiService} from '@app/core/api/mp-reservation-orders.service';
import {MpReservationFilter} from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import {Subject, switchMap, tap} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersFacadeService {
	private readonly filtersChanged$: Subject<MpReservationFilter> = new Subject<MpReservationFilter>();

	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
	) {
		this.filtersChanged$
			.pipe(
				switchMap(filter => {
					return this.mpReservationOrdersApiService.getOrders(filter);
				}),
				untilDestroyed(this),
			)
			.subscribe();

	}

	public applyFiltersOrders(filters: MpReservationFilter): void {
		this.filtersChanged$.next(filters);
	}
}
