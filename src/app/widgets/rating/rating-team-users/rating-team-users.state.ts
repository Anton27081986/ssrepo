import { Injectable } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	switchMap,
	combineLatest,
	NEVER,
	tap,
	debounceTime,
} from 'rxjs';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { IRatingTeamsResponse } from '@app/core/utils/response';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RatingService } from '@app/widgets/rating/rating.service';
import { RatingTeamsStateService } from '@app/widgets/rating/rating-teams/rating-teams.state';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class RatingTeamUsersState {
	public teamUsers$: Observable<IRatingTeamsResponse<IRankItemDto>>;

	public readonly offset$: BehaviorSubject<number> =
		new BehaviorSubject<number>(0);

	public readonly isLoading$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	public limit = 8;
	public pageSize = 6;
	public pageIndex = 1;

	constructor(
		private readonly service: RatingService,
		private readonly ratingTeamsStateService: RatingTeamsStateService,
	) {
		this.ratingTeamsStateService.isLoading$
			.pipe(untilDestroyed(this))
			.subscribe((val) => {
				if (val) {
					this.isLoading$.next(true);
				}
			});

		this.teamUsers$ = combineLatest([
			this.ratingTeamsStateService.walkerControl.valueChanges,
			this.offset$,
		]).pipe(
			tap(() => this.isLoading$.next(true)),
			debounceTime(2000),
			filterTruthy(),
			switchMap(([walker, offset]) => {
				if (!this.ratingTeamsStateService.week$.value) {
					return NEVER;
				}

				return this.service.getRatings(
					this.ratingTeamsStateService.week$.value.id,
					walker.id,
					this.limit,
					offset,
				);
			}),
			tap(() => this.isLoading$.next(false)),
		);
	}
}
