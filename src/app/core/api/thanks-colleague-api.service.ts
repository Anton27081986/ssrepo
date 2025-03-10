import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { ICreateThanksColleagueRequest } from '@app/core/models/thanks-colleagues/create-thanks-colleague-request';

@Injectable({
	providedIn: 'root',
})
export class ThanksColleagueApiService {
	public constructor(private readonly http: HttpClient) {}

	public getThanksColleagueList(
		Limit: number,
		Offset: number,
	): Observable<IResponse<IThanksColleagueItem>> {
		return this.http.get<IResponse<IThanksColleagueItem>>(
			`${environment.apiUrl}/api/awards/thanks`,
			{
				params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
			},
		);
	}

	public addThanksColleague(
		createThanksRequest: ICreateThanksColleagueRequest,
	): Observable<IThanksColleagueItem> {
		return this.http.post<IThanksColleagueItem>(
			`${environment.apiUrl}/api/awards/thanks`,
			createThanksRequest,
		);
	}

	// Удалить спасибо коллеге по id
	public deleteThanksColleague(id: number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}/api/awards/thanks/${id}`);
	}
}
