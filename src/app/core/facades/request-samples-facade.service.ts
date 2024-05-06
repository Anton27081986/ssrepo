import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRequestSamplesFilter } from '@app/core/models/request-samples-filter';
import { ISampleItemDto } from '@app/core/models/company/sample-item-dto';
import { RequestSamplesApiService } from '@app/core/api/request-samples-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class RequestSamplesFacadeService {
	private readonly filtersChanged: Subject<IRequestSamplesFilter> =
		new Subject<IRequestSamplesFilter>();

	private readonly samples = new BehaviorSubject<ISampleItemDto>({});
	public samples$ = this.samples.asObservable();

	public constructor(private readonly requestSamplesApiService: RequestSamplesApiService) {
		this.filtersChanged
			.pipe(
				switchMap(filter => {
					return this.requestSamplesApiService.getRequestSamples(filter);
				}),
				tap(sales => {
					this.samples.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: ISaleRequestsFilter) {
		this.filtersChanged.next(filters);
	}
}
