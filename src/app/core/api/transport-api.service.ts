import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ITransportDto } from '@app/core/models/company/transport-dto';
import { ITransportNotifyDto } from '@app/core/models/company/transport-notify-dto';

@Injectable({
	providedIn: 'root',
})
export class TransportApiService {
	constructor(private readonly http: HttpClient) {}

	/** Получить расписание транспорта */
	public getTransport(): Observable<ITransportDto> {
		return this.http.get<ITransportDto>(
			`${environment.apiUrl}/api/company/transport`
		);
	}

	/** Добавить уведомление в расписание транспорта */
	public sendTransportNote(
		transportNotify: ITransportNotifyDto
	): Observable<ITransportNotifyDto> {
		return this.http.post<ITransportNotifyDto>(
			`${environment.apiUrl}/api/company/transport`,
			transportNotify
		);
	}
}
