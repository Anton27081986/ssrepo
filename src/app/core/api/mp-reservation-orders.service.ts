import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IMpReservationOrders } from '@app/core/models/mp-reservation-orders/mp-reservation-orders';

@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersApiService {
	public constructor(private readonly http: HttpClient) {}

	public getOrders(filter: MpReservationFilter): Observable<IResponse<IMpReservationOrders>> {

		//TODO Переделать метод для получения Orders с бека (вопрос по методу)
		return  this.http.post<IResponse<IMpReservationOrders>>(
			`${environment.apiUrl}/api/company/clients`,
			filter,
		);
	}
}
