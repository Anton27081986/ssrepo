import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {MpReservationFilter} from "@app/core/models/mp-reservation-orders/mp-reservation-orders-filter";
import {IResponse} from "@app/core/utils/response";
import {IClientItemDto} from "@app/core/models/company/client-item-dto";
import {environment} from "@environments/environment";

@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersApiService {

	public constructor(private readonly http: HttpClient) {
	}



	public getOrders(filter: MpReservationFilter) {
	//TODO Переделать метод для получения Orders с бека
		return this.http.post<IResponse<MpReservationFilter>>(
			`${environment.apiUrl}/api/company/clients`,
			filter,
		);
	}
}
