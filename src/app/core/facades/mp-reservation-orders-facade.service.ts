import { Injectable } from '@angular/core';
import { MpReservationOrdersApiService } from '@app/core/api/mp-reservation-orders.service';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from '@app/core/utils/response';
import { IMpReservationOrders } from '@app/core/models/mp-reservation-orders/mp-reservation-orders';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersFacadeService {
	private readonly filtersChanged$: Subject<MpReservationFilter> =
		new Subject<MpReservationFilter>();
	private readonly orders = new BehaviorSubject<IResponse<IMpReservationOrders>>(
		{} as IResponse<any>,
	);
	public orders$ = this.orders.asObservable();

	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
	) {
		this.filtersChanged$
			.pipe(
				switchMap(filter => {
					return this.mpReservationOrdersApiService.getOrders(filter);
				}),
				tap(orders => this.orders.next(orders)),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFiltersOrders(filters: MpReservationFilter): void {
		this.filtersChanged$.next(filters);
	}
}
