import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import {
	BehaviorSubject,
	combineLatest,
	map,
	Observable,
	switchMap,
	tap,
} from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { INewsDto } from '@app/core/models/client-proposails/news';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsNewsLineTabState {
	public news$: Observable<IResponse<INewsDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	constructor(
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService
	) {
		this.news$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				this.isLoader$.next(true);

				return this.clientProposalsFacadeService.getNewsByClientId({
					clientId: id,
					limit: this.pageSize,
					offset,
				});
			}),
			switchMap((item) => {
				return item;
			}),
			tap(() => this.isLoader$.next(false))
		);
	}
}
