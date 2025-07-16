import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IContractsFilter } from '@app/core/models/contracts-filter';
import { IContractsItemDto } from '@app/core/models/company/contracts-item-dto';
import { ContractsApiService } from '@app/core/api/contracts-api.service';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ContractsFacadeService {
	private readonly filtersChanged: Subject<IContractsFilter> =
		new Subject<IContractsFilter>();

	private readonly contracts = new BehaviorSubject<IContractsItemDto>({});
	public contracts$ = this.contracts.asObservable();

	constructor(private readonly contractsApiService: ContractsApiService) {
		this.filtersChanged
			.pipe(
				switchMap((filter) => {
					return this.contractsApiService.getContracts(filter);
				}),
				tap((sales) => {
					this.contracts.next(sales);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public applyFilters(filters: IContractsFilter) {
		this.filtersChanged.next(filters);
	}
}
