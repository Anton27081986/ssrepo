import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RatingStoreService {
	private readonly ratingWeeksSubject = new BehaviorSubject<any>(null);
	public ratingWeeks$ = this.ratingWeeksSubject.asObservable();

	public constructor(private readonly apiService: ApiService) {
		this.init();
	}

	private init() {
		this.loadRatingWeeks().subscribe();
	}

	public loadRatingWeeks(): Observable<any> {
		return this.apiService.getLastFiveRatingWeeks().pipe(
			map(({ items }) => items),
			tap(x => {
				console.log(x);
				this.ratingWeeksSubject.next(x);
			}),
		);
	}
}
