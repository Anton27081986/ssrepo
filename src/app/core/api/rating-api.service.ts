import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { IRatingTeamsResponse, IResponse } from '@app/core/utils/response';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import { ICommentRequest } from '@app/core/models/awards/comment-request';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';

export enum TypeReport {
	weekly = 0,
	quarter = 1,
}

@Injectable({
	providedIn: 'root',
})
export class RatingApiService {
	public constructor(private readonly http: HttpClient) {}

	public getRatingTypes(weekId: number, userId: number): Observable<IRankTypeListDto> {
		return this.http.get<IRankTypeListDto>(`${environment.apiUrl}/api/awards/rank/types`, {
			params: new HttpParams().set('weekId', weekId).set('userId', userId),
		});
	}

	public getCommentsWins(request: ICommentRequest): Observable<IResponse<ICommentsItemDto>> {
		return this.http.get<IResponse<ICommentsItemDto>>(
			`${environment.apiUrl}/api/awards/comments/${request.objectId}`,
			{
				params: new HttpParams()
					.set('Type', request.type)
					.set('Offset', 0)
					.set('Limit', 1000),
			},
		);
	}

	/** Список последних 5 недель */
	public getLastFiveRatingWeeks(): Observable<IResponse<IWeekItemDto>> {
		return this.http.get<IResponse<IWeekItemDto>>(
			`${environment.apiUrl}/api/awards/rank/weeks`,
		);
	}

	public getReport(type: TypeReport, rank: IRankTypeItemDto) {
		return this.http.post<string>(`${environment.apiUrl}/api/awards/rank/report/${type}`, rank);
	}

	/** Список пользователей в выбранном рейтинге */
	public getRatings(
		weekId: number,
		RankTypeId: number,
		Limit: number,
		Offset: number,
	): Observable<IRatingTeamsResponse<IRankItemDto>> {
		return this.http.get<IRatingTeamsResponse<IRankItemDto>>(
			`${environment.apiUrl}/api/awards/rank`,
			{
				params: new HttpParams()
					.set('WeekId', weekId)
					.set('RankTypeId', RankTypeId)
					.set('Limit', Limit)
					.set('Offset', Offset),
			},
		);
	}
}
