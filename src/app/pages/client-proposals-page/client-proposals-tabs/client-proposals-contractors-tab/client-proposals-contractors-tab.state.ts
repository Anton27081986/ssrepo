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
import { IResponse, IResponseProposalsTrips } from '@app/core/utils/response';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsContractorsTabState {
	public contractors$: Observable<IResponse<IContractorsDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	public isArchiver$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	constructor(
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this.contractors$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				this.isLoader$.next(true);
				const withArchiver = this.isArchiver$.value;

				return this.clientProposalsFacadeService.getContractors({
					clientId: id,
					limit: this.pageSize,
					offset,
					withArchiver,
				});
			}),
			switchMap((item) => {
				return item;
			}),
			tap(() => this.isLoader$.next(false)),
		);
	}
}
