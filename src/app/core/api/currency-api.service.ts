import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IExchangeRates } from '@app/core/models/exchange-rates';

@Injectable({
	providedIn: 'root',
})
export class CurrencyApiService {
	constructor(private readonly http: HttpClient) {}

	/** Получить котировки валют **/
	public getExchangeRates(): Observable<IExchangeRates> {
		return this.http.get<IExchangeRates>(
			`${environment.apiUrl}/api/company/Currency`
		);
	}
}
