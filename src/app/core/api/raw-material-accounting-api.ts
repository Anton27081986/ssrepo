import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRawMaterialAccountingContract } from '@app/core/models/raw-material-accounting/contract';
import { IResponse } from '@app/core/utils/response';
import { IRawMaterialAccountingFilter } from '@app/core/models/raw-material-accounting/raw-material-accounting-filter';
import { AddContractDto } from '@app/core/models/raw-material-accounting/add-contract-dto';

@Injectable({
	providedIn: 'root',
})
export class RawMaterialAccountingApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Получить список договоров */
	public getContracts(
		filter: IRawMaterialAccountingFilter,
	): Observable<{ data: IResponse<IRawMaterialAccountingContract>; permissions: string[] }> {
		let params = new HttpParams();

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		if (filter.ContractNumber) {
			params = params.set('ContractNumber', filter.ContractNumber);
		}

		if (filter.ContractorId) {
			params = params.set('ContractorId', filter.ContractorId);
		}

		if (filter.UserIds) {
			filter.UserIds.forEach(param => {
				params = params.append('UserIds', param);
			});
		}

		if (filter.ContractDetailId) {
			params = params.set('ContractDetailId', filter.ContractDetailId);
		}

		if (filter.statuses) {
			filter.statuses.forEach(param => {
				params = params.append('Statuses', param);
			});
		}

		return this.http.get<{
			data: IResponse<IRawMaterialAccountingContract>;
			permissions: string[];
		}>(`${environment.apiUrl}/api/procurements/contracts`, { params });
	}

	/** Получить договоров по идентификатору */
	public getContractById(
		id: string,
	): Observable<{ data: IRawMaterialAccountingContract; permissions: string[] }> {
		return this.http.get<{ data: IRawMaterialAccountingContract; permissions: string[] }>(
			`${environment.apiUrl}/api/procurements/contracts/${id}`,
		);
	}

	/** Добавить договор */
	public addContract(contract: AddContractDto): Observable<IRawMaterialAccountingContract> {
		return this.http.post<IRawMaterialAccountingContract>(
			`${environment.apiUrl}/api/procurements/contracts`,
			contract,
		);
	}

	/** Редактировать договор */
	public editContract(
		id: number,
		contract: AddContractDto,
	): Observable<IRawMaterialAccountingContract> {
		return this.http.put<IRawMaterialAccountingContract>(
			`${environment.apiUrl}/api/procurements/contracts/${id}`,
			contract,
		);
	}
}
