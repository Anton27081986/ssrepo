import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsDevelopmentTabState {
	public developments$: Observable<IResponse<IDevelopmentDto>>;
	public pageSize = 4;
	public pageIndex = 1;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isCompleting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private readonly clientProposalsFacadeService: ClientProposalsFacadeService) {
		this.developments$ = combineLatest([
			this.clientProposalsFacadeService.clientId$,
			this.offset$,
		]).pipe(
			filterTruthy(),
			map(([id, offset]) => {
				this.isLoader$.next(true);

				const isCompleting = this.isCompleting$.value;

				return this.clientProposalsFacadeService.getDevelopment({
					clientId: id,
					limit: this.pageSize,
					offset,
					isCompleting,
				});
			}),
			switchMap(item => {
				return item;
			}),
			tap(() => this.isLoader$.next(false)),
		);
	}
}
