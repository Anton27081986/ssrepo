import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ThanksColleagueApiService } from '@app/core/api/thanks-colleague-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { ICreateThanksColleagueRequest } from '@app/core/models/thanks-colleagues/create-thanks-colleague-request';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ThankColleagueFacadeService {
	private readonly thanksForColleagues = new BehaviorSubject<IThanksColleagueItem[]>([]);
	public thanksForColleagues$: Observable<IThanksColleagueItem[]> =
		this.thanksForColleagues.asObservable();

	public isExtendedMode = false;
	public offset = 0;
	public pageSize = 12;
	public total = 0;

	public constructor(private readonly apiService: ThanksColleagueApiService) {
		this.loadThanksForColleagues();
	}

	public loadThanksForColleagues() {
		this.apiService
			.getThanksColleagueList(this.pageSize, this.offset)
			.pipe(
				untilDestroyed(this),
				tap(response => {
					this.thanksForColleagues.next([
						...this.thanksForColleagues.value,
						...response.items,
					]);
					this.total = response.total;
					this.isExtendedMode = response.isExtendedMode || false;
				}),
			)
			.subscribe();
	}

	public loadMoreThanksForColleagues() {
		if (this.total > this.offset) {
			this.offset += this.pageSize;
			this.loadThanksForColleagues();
		}
	}

	public addThanksForColleague(createThanksRequest: ICreateThanksColleagueRequest): Observable<IThanksColleagueItem> {
		return this.apiService.addThanksColleague(createThanksRequest).pipe(
			untilDestroyed(this),
			tap(() => {
				this.loadThanksForColleagues();
			}),
		);
	}

	public resetThanks() {
		this.thanksForColleagues.next([]);
		this.loadThanksForColleagues()
	}
}
