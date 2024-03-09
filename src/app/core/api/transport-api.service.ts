import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITransport } from '@app/core/models/transport';
import { environment } from '@environments/environment.development';
import { IExchangeRates } from '@app/core/models/exchange-rates';

@Injectable({
	providedIn: 'root',
})
export class TransportApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Получить расписание транспорта */
	public getTransport(): Observable<ITransport> {
		return this.http.get<ITransport>(`${environment.apiUrl}/api/company/transport`);
	}

	/** Добавить уведомление в расписание транспорта */
	public sendTransportNote(
		dFrom: string | undefined,
		dTo: string | undefined,
		note: string | undefined,
	): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/api/company/transport`, {
			dFrom,
			dTo,
			note,
		});
	}
}
