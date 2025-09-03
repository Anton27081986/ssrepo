import { Injectable } from '@angular/core';
import { MpReservationOrdersApiService } from '@app/core/api/mp-reservation-orders.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	IMpReservationOrder,
	IProvisionDetailsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { IClarifyOrder } from '@app/pages/mp-reservation/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification.models';
import { IWarehouseBalanceResponse } from '@app/core/models/mp-reservation-orders/mp-reservation-warehouse-stock';
import {
	IDispatchDto,
	IDispatchesRequest,
} from '@app/core/models/mp-reservation-orders/mp-reservation-transfer-dispatch';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrderCardFacadeService {
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	private readonly activeOrder =
		new BehaviorSubject<IMpReservationOrder | null>(null);

	public activeOrder$ = this.activeOrder.asObservable();

	private readonly permissions = new BehaviorSubject<string[]>([]);

	public permissions$ = this.permissions.asObservable();

	private readonly warehouseBalanceSubject =
		new BehaviorSubject<IWarehouseBalanceResponse | null>(null);

	public readonly warehouseBalance$ =
		this.warehouseBalanceSubject.asObservable();

	constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
		protected readonly router: Router
	) {}

	public getPersonificationById(id: string): void {
		this.mpReservationOrdersApiService
			.getPersonificationById(id)
			.pipe(
				untilDestroyed(this),
				catchError((err: unknown) => {
					this.router.navigate(['mp-reservation-orders']);
					throw err;
				})
			)
			.subscribe((res) => {
				this.activeOrder.next(res.data);
				this.permissions.next(res.permissions);
			});
	}

	public reloadOrder(): void {
		this.getPersonificationById(this.activeOrder.value!.id.toString());
	}

	public rejectOrder(reason: string) {
		return this.mpReservationOrdersApiService.rejectPersonification(
			this.activeOrder.value?.id!,
			reason
		);
	}

	public updateProvisionDateById(
		orderId: number,
		provisionDate: string,
		provisionId: number
	) {
		return this.mpReservationOrdersApiService.updateProvisionDateById(
			orderId,
			provisionDate,
			provisionId
		);
	}

	public removeOrder() {
		return this.mpReservationOrdersApiService.removePersonification(
			this.activeOrder.value?.id!
		);
	}

	public rejectRemove() {
		return this.mpReservationOrdersApiService.rejectRemovePersonification(
			this.activeOrder.value?.id!
		);
	}

	public addDetails(details: IProvisionDetailsTypes[]) {
		return this.mpReservationOrdersApiService.createDetails(
			this.activeOrder.value?.id!,
			details
		);
	}

	public changeDetails(details: IProvisionDetailsTypes) {
		return this.mpReservationOrdersApiService.changeDetails(
			this.activeOrder.value?.id!,
			details
		);
	}

	public changeManager(authorId: number) {
		return this.mpReservationOrdersApiService.changeManager(
			this.activeOrder.value?.id!,
			authorId
		);
	}

	public clarifyOrder(body: IClarifyOrder) {
		return this.mpReservationOrdersApiService.clarify(
			this.activeOrder.value?.id!,
			body
		);
	}

	public rejectClarificationOrder() {
		return this.mpReservationOrdersApiService.rejectClarification(
			this.activeOrder.value?.id!
		);
	}

	public getApproveClarification() {
		return this.mpReservationOrdersApiService.getApproveClarification(
			this.activeOrder.value?.id!
		);
	}

	public approveClarification() {
		return this.mpReservationOrdersApiService.approveClarification(
			this.activeOrder.value?.id!
		);
	}

	public loadWarehouseBalance(orderId: number): void {
		this.mpReservationOrdersApiService
			.getWarehouseForAgreeOrder(orderId)
			.pipe(
				tap((warehouseBalance) =>
					this.warehouseBalanceSubject.next(warehouseBalance)
				),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public dispatchToQueue(
		orderId: number,
		dispatches: IDispatchDto[]
	): Observable<void> {
		const payload: IDispatchesRequest = { dispatches };

		return this.mpReservationOrdersApiService.createTransferInvoice(
			orderId,
			payload
		);
	}
}
