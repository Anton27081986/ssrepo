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
	public instructionFileLink =
		'https://erp.ssnab.ru/api/static/general/2024/10/22/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F_%D0%A3%D1%87%D0%B5%D1%82_%D0%B7%D0%B0%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE_%D1%81%D1%8B%D1%80%D1%8C%D1%8F_bb595d3f-a948-4fc3-958f-1a176fcd24e9.docx';

	// Индикатор загрузки
	private readonly isContractsLoadingSubject = new BehaviorSubject<boolean>(
		true
	);

	public isContractsLoading$ = this.isContractsLoadingSubject.asObservable();

	private readonly isContractLoadingSubject = new BehaviorSubject<boolean>(
		true
	);

	public isContractLoading$ = this.isContractLoadingSubject.asObservable();

	// Договоры
	private readonly contractsSubject =
		new BehaviorSubject<IResponse<IRawMaterialAccountingContract> | null>(
			null
		);

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
	private readonly statusesSubject = new BehaviorSubject<
		IResponse<IDictionaryItemDto>
	>({} as IResponse<any>);

	public statuses$ = this.statusesSubject.asObservable();

	// Договоры из КИСП
	private readonly contractDetailsSubject = new BehaviorSubject<
		IResponse<IDictionaryItemDto>
	>({} as IResponse<any>);

	public contractDetails$ = this.contractDetailsSubject.asObservable();

	constructor(
		private readonly rawMaterialAccountingApiService: RawMaterialAccountingApiService,
		private readonly dictionaryApiService: DictionaryApiService
	) {
		this.dictionaryApiService
			.getProcurementsStatuses()
			.pipe(
				tap((statuses) => {
					this.statusesSubject.next(statuses);
				}),
				untilDestroyed(this)
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
				})
			)
			.subscribe((contracts) => {
				this.contractsSubject.next(contracts.data);
				this.permissionsSubject.next(contracts.permissions);
				this.isContractsLoadingSubject.next(false);
			});
	}

	public getContractDetails(ContractorId: number): void {
		this.dictionaryApiService
			.getProcurementsContractDetails(ContractorId)
			.pipe(
				tap((contractDetails) => {
					this.contractDetailsSubject.next(contractDetails);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public selectContract(id: string | null): void {
		if (id) {
			this.isContractLoadingSubject.next(true);
			this.rawMaterialAccountingApiService
				.getContractById(id)
				.pipe(untilDestroyed(this))
				.subscribe((contract) => {
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
