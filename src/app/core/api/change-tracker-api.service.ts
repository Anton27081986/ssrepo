import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { environment } from '@environments/environment.development';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ChangeTrackerApiService {
	public constructor(private readonly http: HttpClient) {}

	public getHistoryOfObject(objectId: number, type: number, limit: number, offset: number) {
		let params = new HttpParams();

		params = params.set('objectId', objectId);
		params = params.set('type', type);
		params = params.set('limit', limit);
		params = params.set('offset', offset);

		return this.http.get<IResponse<IChangeTrackerItemDto>>(
			`${environment.apiUrl}/api/change-tracker/changeTracker`,
			{ params },
		);
	}
}
