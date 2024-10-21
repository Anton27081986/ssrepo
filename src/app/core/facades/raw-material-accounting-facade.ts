import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IRawMaterialAccountingContract } from '@app/core/models/raw-material-accounting/contract';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RawMaterialAccountingApiService } from '@app/core/api/raw-material-accounting-api';
import { IResponse } from '@app/core/utils/response';
import { IRawMaterialAccountingFilter } from '@app/core/models/raw-material-accounting/raw-material-accounting-filter';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { AddContractDto } from '@app/core/models/raw-material-accounting/add-contract-dto';
import { catchError } from 'rxjs/operators';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class RawMaterialAccountingFacadeService {
	// Индикатор загрузки
	private readonly isContractsLoadingSubject = new BehaviorSubject<boolean>(true);

	public isContractsLoading$ = this.isContractsLoadingSubject.asObservable();

	private readonly isContractLoadingSubject = new BehaviorSubject<boolean>(true);

	public isContractLoading$ = this.isContractLoadingSubject.asObservable();

	// Договоры
	private readonly contractsSubject =
		new BehaviorSubject<IResponse<IRawMaterialAccountingContract> | null>(null);

	public contracts$ = this.contractsSubject.asObservable();

	// Выбранный договор
	private readonly selectedContractSubject = new BehaviorSubject<{
		data: IRawMaterialAccountingContract;
		permissions: string[];
	} | null>(null);

	public selectedContract$ = this.selectedContractSubject.asObservable();

	// Права
	private readonly permissionsSubject = new BehaviorSubject<string[]>([]);

	public permissions$ = this.permissionsSubject.asObservable();

	// Статусы
	private readonly statusesSubject = new BehaviorSubject<IResponse<IDictionaryItemDto>>(
		{} as IResponse<any>,
	);

	public statuses$ = this.statusesSubject.asObservable();

	// Договоры из КИСП
	private readonly contractDetailsSubject = new BehaviorSubject<IResponse<IDictionaryItemDto>>(
		{} as IResponse<any>,
	);

	public contractDetails$ = this.contractDetailsSubject.asObservable();

	public constructor(
		private readonly rawMaterialAccountingApiService: RawMaterialAccountingApiService,
		private readonly dictionaryApiService: DictionaryApiService,
	) {
		this.dictionaryApiService
			.getProcurementsStatuses()
			.pipe(
				tap(statuses => {
					this.statusesSubject.next(statuses);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getContracts(filter: IRawMaterialAccountingFilter): void {
		this.isContractsLoadingSubject.next(true);
		this.rawMaterialAccountingApiService
			.getContracts(filter)
			.pipe(
				untilDestroyed(this),
				catchError((error: unknown) => {
					this.isContractsLoadingSubject.next(false);
					throw error;
				}),
			)
			.subscribe(contracts => {
				this.contractsSubject.next(contracts.data);
				this.permissionsSubject.next(contracts.permissions);
				this.isContractsLoadingSubject.next(false);
			});
	}

	public getContractDetails(ContractorId: string): void {
		this.dictionaryApiService
			.getProcurementsContractDetails(ContractorId)
			.pipe(
				tap(contractDetails => {
					this.contractDetailsSubject.next(contractDetails);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public selectContract(id: string | null): void {
		if (id) {
			this.isContractLoadingSubject.next(true);
			this.rawMaterialAccountingApiService
				.getContractById(id)
				.pipe(untilDestroyed(this))
				.subscribe(contract => {
					this.selectedContractSubject.next(contract);
					this.isContractLoadingSubject.next(false);
				});
		} else {
			this.selectedContractSubject.next(null);
		}
	}

	public addContract(contract: AddContractDto) {
		return this.rawMaterialAccountingApiService.addContract(contract);
	}

	public editContract(id: number, contract: AddContractDto) {
		return this.rawMaterialAccountingApiService.editContract(id, contract);
	}
}
