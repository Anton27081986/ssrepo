import { Injectable } from '@angular/core';
import { RatingApiService, TypeReport } from '@app/core/api/rating-api.service';
import { Observable } from 'rxjs';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import { IRatingTeamsResponse, IResponse } from '@app/core/utils/response';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';

@Injectable({ providedIn: 'root' })
export class RatingService {
	constructor(private readonly apiService: RatingApiService) {}

	public getRatingTypes(
		weekId: number,
		userId: number
	): Observable<IRankTypeListDto> {
		return this.apiService.getRatingTypes(weekId, userId);
	}

	public getLastFiveRatingWeeks(): Observable<IResponse<IWeekItemDto>> {
		return this.apiService.getLastFiveRatingWeeks();
	}

	public getRatingReport(type: TypeReport, rank: IRankTypeItemDto) {
		return this.apiService.getReport(type, rank);
	}

	public getRatings(
		weekId: number,
		RankTypeId: number,
		Limit: number,
		Offset: number
	): Observable<IRatingTeamsResponse<IRankItemDto>> {
		return this.apiService.getRatings(weekId, RankTypeId, Limit, Offset);
	}
}
