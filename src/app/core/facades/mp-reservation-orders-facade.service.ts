import { Injectable } from "@angular/core";
import { MpReservationOrdersApiService } from "@app/core/api/mp-reservation-orders.service";

@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersFacadeService {
	public constructor(
		private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
	) {
	}
}
