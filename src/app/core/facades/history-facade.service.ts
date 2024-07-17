import { Injectable } from '@angular/core';
import { ChangeTrackerApiService } from '@app/core/api/change-tracker-api.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class HistoryFacadeService {
	public constructor(private readonly changeTrackerApiService: ChangeTrackerApiService) {}

	public getHistory(objectId: number, type: number, limit: number, offset: number) {
		return this.changeTrackerApiService.getHistoryOfObject(objectId, type, limit, offset);
	}
}
