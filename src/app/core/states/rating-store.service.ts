import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RatingStoreService implements OnDestroy {
	private readonly ratingWeeksSubject = new BehaviorSubject<any>(null);
	public ratingWeeks$ = this.ratingWeeksSubject.asObservable();
	private readonly subscription: Subscription = new Subscription();

	public constructor(private readonly apiService: ApiService) {
		this.init();
	}

	private init() {
		const sub = this.loadRatingWeeks().subscribe();

		this.subscription.add(sub);
	}

	public loadRatingWeeks(): Observable<any> {
		return this.apiService.getLastFiveRatingWeeks().pipe(
			map(({ items }) => items),
			tap(x => {
				this.ratingWeeksSubject.next(x);
			}),
		);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
