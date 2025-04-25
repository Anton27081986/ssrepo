import { Injectable } from '@angular/core';
import { MpReservationOrdersApiService } from '@app/core/api/mp-reservation-orders.service';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {IMpReservationOrder, IProvisionDetailsTypes} from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrderCardFacadeService {
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly activeOrder = new BehaviorSubject<IMpReservationOrder | null>(null);
	public activeOrder$ = this.activeOrder.asObservable();

	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
		protected readonly router: Router
	) {}

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

	public reloadOrder(): void {
		this.getPersonificationById(this.activeOrder.value!.id.toString());
	}

	public rejectOrder(reason: string) {
		return this.mpReservationOrdersApiService.rejectPersonification(this.activeOrder.value?.id!, reason);
	}

	public addDetails(details: IProvisionDetailsTypes) {
		return this.mpReservationOrdersApiService.createDetails(this.activeOrder.value?.id!, details);
	}
}
