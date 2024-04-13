import { Injectable } from '@angular/core';
import { ChangeTrackerApiService } from '@app/core/api/change-tracker-api.service';
import { BehaviorSubject, map, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class HistoryFacadeService {
	private readonly historySubject = new BehaviorSubject<IChangeTrackerItemDto[]>([]);
	public historyItems$ = this.historySubject.asObservable();

	public constructor(private readonly changeTrackerApiService: ChangeTrackerApiService) {}

	public getHistory(objectId: number, type: number, limit: number, offset: number) {
		this.changeTrackerApiService
			.getHistoryOfObject(objectId, type, limit, offset)
			.pipe(
				map(response => {
					return response.items;
				}),
				tap(historyItems => {
					this.historySubject.next(historyItems);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
