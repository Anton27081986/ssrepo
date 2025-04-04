import { Injectable } from '@angular/core';
import { MpReservationOrdersApiService } from '@app/core/api/mp-reservation-orders.service';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from '@app/core/utils/response';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";

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
	public orders$ = this.orders.asObservable();
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly activeOrder = new BehaviorSubject<IMpReservationOrder | null>(null);
	public activeOrder$ = this.activeOrder.asObservable();

	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
		protected readonly router: Router
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
				tap(orders => console.log(orders)),
				untilDestroyed(this),
				catchError((err: unknown) => {
					this.isLoader$.next(false);
					throw err;
				}),
			)
			.subscribe();
	}

	public applyFiltersOrders(filters: MpReservationFilter): void {
		this.isLoader$.next(true);
		this.filtersChanged$.next(filters);
	}

	public getPersonificationById(id: string): void {
		this.mpReservationOrdersApiService
			.getPersonificationById(id)
			.pipe(
				untilDestroyed(this),
				catchError(
				(err: unknown)=> {
					this.router.navigate(['mp-reservation-orders']);
					throw err
				})
			)
			.subscribe(res => {
				this.activeOrder.next(res.data);
			});
	}

	public createOrder(body: IMpReservationAddOrder): void {
		console.log('Form is create');
		this.mpReservationOrdersApiService
			.createOrderPersonification(body)
			.pipe(
				untilDestroyed(this),
				tap(response => {
					const currentOrders = this.orders.getValue();
					const updatedItems = currentOrders.items
						? [...currentOrders.items, ...response]
						: [...response];
					this.orders.next({
						...currentOrders,
						items: updatedItems,
						total: updatedItems.length,
					});
				}),
			)
			.subscribe(res => {});
	}
}
