import { Injectable } from '@angular/core';
import { MpReservationOrdersApiService } from '@app/core/api/mp-reservation-orders.service';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { BehaviorSubject, forkJoin, Observable, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from '@app/core/utils/response';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersFacadeService {
	private readonly filtersChanged$: Subject<MpReservationFilter> =
		new Subject<MpReservationFilter>();
	private readonly orders = new BehaviorSubject<IResponse<IMpReservationOrder>>({
		items: [],
		total: 0,
	} as unknown as IResponse<any>);
	private lastUsedFilters: MpReservationFilter = {
		limit: 10,
		offset: 0,
	};

	private readonly personificationStatuses = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public personificationStatuses$ = this.personificationStatuses.asObservable();
	public orders$ = this.orders.asObservable();
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly activeOrder = new BehaviorSubject<IMpReservationOrder | null>(null);
	public activeOrder$ = this.activeOrder.asObservable();

	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
		protected readonly router: Router,
		private readonly searchFacade: SearchFacadeService,
	) {
		this.filtersChanged$
			.pipe(
				switchMap(filter => {
					return this.mpReservationOrdersApiService.getOrders(filter);
				}),
				tap(orders => {
					this.orders.next(orders.data);
					this.isLoader$.next(false);
				}),
				untilDestroyed(this),
				catchError((err: unknown) => {
					this.isLoader$.next(false);
					throw err;
				}),
			)
			.subscribe();

		this.searchFacade
			.getPersonificationStatuses()
			.pipe(untilDestroyed(this))
			.subscribe(value => this.personificationStatuses.next(value.items));
	}

	public applyFiltersOrders(filters: MpReservationFilter): void {
		this.lastUsedFilters = { ...filters };
		this.isLoader$.next(true);
		this.filtersChanged$.next(filters);
	}

	public createOrder(body: IMpReservationAddOrder): void {
		this.mpReservationOrdersApiService
			.createOrderPersonification(body)
			.pipe(
				tap(newOrders => {
					const current = this.orders.getValue();
					const totalBefore = current.total;
					const totalAfter = totalBefore + newOrders.length;
					const { limit = newOrders.length } = this.lastUsedFilters;
					const lastPageIndex = Math.ceil(totalAfter / limit);
					const lastOffset = limit * (lastPageIndex - 1);

					this.applyFiltersOrders({
						...this.lastUsedFilters,
						offset: lastOffset,
						limit: limit,
					});
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public updateProvisionDates(orderIds: number[], provisionDate: string): void {
		forkJoin(
			orderIds.map(id =>
				this.mpReservationOrdersApiService.updateProvisionDate(id, provisionDate),
			),
		)
			.pipe(
				tap(() => {
					const currentOrders = this.orders.getValue();
					const updatedOrders = currentOrders.items.map(order => {
						if (!orderIds.includes(order.id)) return order;

						const provisionDetails = order.provision.provisionDetails || [];
						const updatedDetails = provisionDetails.map(detail => {
							const detailTime = new Date(detail.provisionDate!).getTime();
							const minTime = Math.min(
								...provisionDetails.map(detail =>
									new Date(detail.provisionDate!).getTime(),
								),
							);
							const allEqual = provisionDetails.every(
								detail => new Date(detail.provisionDate!).getTime() === minTime,
							);

							return {
								...detail,
								provisionDate:
									allEqual || detailTime === minTime
										? provisionDate
										: detail.provisionDate,
							};
						});

						return {
							...order,
							provision: {
								...order.provision,
								provisionDetails: updatedDetails,
							},
						};
					});

					this.orders.next({
						...currentOrders,
						items: updatedOrders,
					});
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getHistoryOrder(
		objectId: string,
		limit: number,
		offset: number,
	): Observable<IResponse<IChangeTrackerItemDto>> {
		return this.mpReservationOrdersApiService.getHistoryOrder(objectId, limit, offset);
	}
}
