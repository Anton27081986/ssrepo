import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class RatingApiService {
	public constructor(private readonly http: HttpClient) {}

	public getRatingTypes(weekId: any, userId: any): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/types`, {
			params: new HttpParams().set('weekId', weekId).set('userId', userId),
		});
	}

	/** Список последних 5 недель */
	public getLastFiveRatingWeeks(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/weeks`);
	}

	/** Cписок пользователей в выбранном рейтинге */
	public getRatings(
		weekId: number,
		RankTypeId: number,
		Limit: number,
		Offset: number,
	): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank`, {
			params: new HttpParams()
				.set('weekId', weekId)
				.set('RankTypeId', RankTypeId)
				.set('Limit', Limit)
				.set('Offset', Offset),
		});
	}
}
