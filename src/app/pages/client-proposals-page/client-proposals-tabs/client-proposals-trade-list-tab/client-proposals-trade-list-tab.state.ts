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
import { ITradeList } from '@app/core/models/client-proposails/trade-list';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsTradeListTabState {
	public tradeList$: Observable<IResponse<ITradeList>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	public TovIds$: BehaviorSubject<number[] | undefined> = new BehaviorSubject<
		number[] | undefined
	>(undefined);

	public DateFrom$: BehaviorSubject<string | undefined> = new BehaviorSubject<
		string | undefined
	>(undefined);

	public DateTo$: BehaviorSubject<string | undefined> = new BehaviorSubject<
		string | undefined
	>(undefined);

	constructor(
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService
	) {
		this.tradeList$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				this.isLoader$.next(true);
				const TovIds = this.TovIds$.value;
				const DateFrom = this.DateFrom$.value;
				const DateTo = this.DateTo$.value;

				return this.clientProposalsFacadeService.getTradeList({
					clientId: id,
					limit: this.pageSize,
					offset,
					TovIds,
					DateFrom,
					DateTo,
				});
			}),
			switchMap((item) => {
				return item;
			}),
			tap(() => this.isLoader$.next(false))
		);
	}
}
