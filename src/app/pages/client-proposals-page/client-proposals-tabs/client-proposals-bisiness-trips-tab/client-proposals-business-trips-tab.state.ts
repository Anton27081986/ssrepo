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
import { IResponseProposalsTrips } from '@app/core/utils/response';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsBusinessTripsTabState {
	public businessTrips$: Observable<
		IResponseProposalsTrips<IBusinessTripsDto>
	>;

	public onlyCurrentYear$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	constructor(
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this.businessTrips$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				this.isLoader$.next(true);
				const onlyCurrentYear = this.onlyCurrentYear$.value;

				return this.clientProposalsFacadeService.getTrips({
					clientId: id,
					limit: this.pageSize,
					offset,
					onlyCurrentYear,
				});
			}),
			switchMap((item) => {
				return item;
			}),
			tap(() => this.isLoader$.next(false)),
		);
	}
}
