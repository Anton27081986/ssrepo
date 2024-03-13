import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IExchangeRates } from '@app/core/models/exchange-rates';

@Injectable({
	providedIn: 'root',
})
export class CurrencyApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Валюты */
	public getCurrency(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/company/Currency`);
	}

	/** Получить котировки транспорта */
	public getExchangeRates(): Observable<IExchangeRates> {
		return this.http.get<IExchangeRates>(`${environment.apiUrl}/api/company/Currency`);
	}
}
