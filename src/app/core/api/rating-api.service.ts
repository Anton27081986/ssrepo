import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { IResponse } from '@app/core/utils/response';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';

@Injectable({
	providedIn: 'root',
})
export class RatingApiService {
	public constructor(private readonly http: HttpClient) {}

	public getRatingTypes(weekId: number, userId: any): Observable<IRankTypeListDto> {
		return this.http.get<IRankTypeListDto>(`${environment.apiUrl}/api/awards/rank/types`, {
			params: new HttpParams().set('weekId', weekId).set('userId', userId),
		});
	}

	/** Список последних 5 недель */
	public getLastFiveRatingWeeks(): Observable<any> {
		return this.http.get<IResponse<IWeekItemDto>>(
			`${environment.apiUrl}/api/awards/rank/weeks`,
		);
	}

	/** Список пользователей в выбранном рейтинге */
	public getRatings(
		weekId: number,
		RankTypeId: number,
		Limit: number,
		Offset: number,
	): Observable<IResponse<IRankItemDto>> {
		return this.http.get<IResponse<IRankItemDto>>(`${environment.apiUrl}/api/awards/rank`, {
			params: new HttpParams()
				.set('weekId', weekId)
				.set('RankTypeId', RankTypeId)
				.set('Limit', Limit)
				.set('Offset', Offset),
		});
	}
}
