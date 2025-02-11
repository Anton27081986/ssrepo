import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IAuctionSalesDto } from '@app/core/models/sales/auction-sales-dto';

@Injectable({
	providedIn: 'root',
})
export class AuctionSalesApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Sale */
	public getAuctions(Limit: number, Offset: number): Observable<IAuctionSalesDto> {
		return this.http.get<IAuctionSalesDto>(`${environment.apiUrl}/api/sales/widget`, {
			params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
		});
	}
}
