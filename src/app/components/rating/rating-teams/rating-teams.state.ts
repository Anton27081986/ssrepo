import { Injectable } from '@angular/core';
import {
	map,
	Observable,
	switchMap,
	combineLatest,
	shareReplay,
	NEVER,
	BehaviorSubject,
	tap,
	debounceTime,
	take,
} from 'rxjs';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import { RatingService } from '@app/components/rating/rating.service';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';
import { FormControl } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class RatingTeamsStateService {
	public week$: BehaviorSubject<IDictionaryItemDto | null> =
		new BehaviorSubject<IDictionaryItemDto | null>(null);

	public userId$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

	public readonly currentUser$: Observable<IUserProfile> =
		this.userProfileStore.userProfile$.pipe(filterTruthy());

	public readonly rating$: Observable<IRankTypeListDto>;

	public weeks$: Observable<IWeekItemDto[]>;

	public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public readonly reportAvailable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	public walkerControl: FormControl<IRankTypeItemDto> = new FormControl();

	public constructor(
		private readonly userProfileStore: UserProfileStoreService,
		private readonly ratingService: RatingService,
	) {
		this.weeks$ = this.loadLastFiveWeeks();

		this.walkerControl.valueChanges.pipe(untilDestroyed(this)).subscribe(item => {
			this.reportAvailable$.next(item.reportAvailable);
		});

		this.rating$ = combineLatest([this.week$, this.userId$]).pipe(
			tap(() => this.isLoading$.next(true)),
			debounceTime(2000),
			switchMap(([week, userId]) => {
				if (!week || !userId) {
					return NEVER;
				}

				return this.ratingService.getRatingTypes(week.id, userId);
			}),
			tap(() => this.isLoading$.next(false)),
			shareReplay({
				refCount: true,
				bufferSize: 1,
			}),
		);
	}

	public loadLastFiveWeeks(): Observable<IWeekItemDto[]> {
		return this.ratingService.getLastFiveRatingWeeks().pipe(
			map(({ items }) => items),
			shareReplay({
				refCount: true,
				bufferSize: 1,
			}),
		);
	}
}
