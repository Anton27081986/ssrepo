import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { ExcessIncomeApiService } from '@app/pages/excess-income/excess-income-service/excess-income.api-service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ExcessIncomeGroup } from '@app/core/models/excess-income/excess-income-group';
import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov';
import { ExcessIncomeTableData } from '@app/core/models/excess-income/excess-income-table-data';
import { ExcessIncomeContractor } from '@app/core/models/excess-income/excess-income-contractors-Item';
import { ExcessIncomeGroupRequest } from '@app/core/models/excess-income/excess-income-group-request';
import { ExcessIncomeClientRequest } from '@app/core/models/excess-income/excess-income-client-request';
import { ExcessIncomeTovRequest } from '@app/core/models/excess-income/excess-income-tov-request';

@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeService {
	constructor(private readonly apiService: ExcessIncomeApiService) {}

	public getClients(
		request: ExcessIncomeClientRequest,
	): Observable<IResponse<ExcessIncomeClient>> {
		return this.apiService.getClients(request);
	}

	public getGroup(request: ExcessIncomeGroupRequest): Observable<IResponse<ExcessIncomeGroup>> {
		return this.apiService.getGroup(request);
	}

	public getTov(request: ExcessIncomeTovRequest): Observable<IResponse<ExcessIncomeTov>> {
		return this.apiService.getTov(request);
	}

	public getCurrency(): Observable<IResponse<IDictionaryItemDto>> {
		return this.apiService.getCurrency();
	}
}
