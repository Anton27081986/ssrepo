import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { CompletedWorkActsApiService } from '@app/core/api/completed-work-acts-api.service';
import {BehaviorSubject, Subject, switchMap, tap} from 'rxjs';
import { CompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import {ICompletedActsFilter} from "@app/core/models/completed-acts-filter";

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsFacadeService {
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly filters: Subject<ICompletedActsFilter> = new Subject<ICompletedActsFilter>();

	private readonly acts = new BehaviorSubject<IResponse<CompletedWorkAct>>({} as IResponse<any>);
	public acts$ = this.acts.asObservable();
	constructor(private readonly actsApiService: CompletedWorkActsApiService) {
		this.filters
			.pipe(
				switchMap(filters => {
					return this.actsApiService.getWorkActs(filters);
				}),
				tap(acts => {
					this.acts.next(acts);
					this.isLoader$.next(false);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: ICompletedActsFilter) {
		this.isLoader$.next(true);
		this.filters.next(filters);
	}
}
