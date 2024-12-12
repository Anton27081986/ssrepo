import { Injectable } from '@angular/core';
import { merge, Observable, of, switchMap, tap } from 'rxjs';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { ExcessIncomeApiService } from '@app/pages/excess-income/excess-income-service/excess-income.api-service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ExcessIncomeFromBackendGroup } from '@app/core/models/excess-income/excess-income-from-backend-group';
import { ExcessIncomeTovFromBackend } from '@app/core/models/excess-income/excess-income-tov-from-backend';
import { ExcessIncomeGroupRequest } from '@app/core/models/excess-income/excess-income-group-request';
import { ExcessIncomeClientRequest } from '@app/core/models/excess-income/excess-income-client-request';
import { ExcessIncomeTovRequest } from '@app/core/models/excess-income/excess-income-tov-request';
import { ExcessIncomeUpdateClientRequest } from '@app/core/models/excess-income/excess-income-update-client-request';
import { ExcessIncomeUpdateGroupRequest } from '@app/core/models/excess-income/excess-income-update-group-request';
import { ExcessIncomeUpdateTovRequest } from '@app/core/models/excess-income/excess-income-update-tov-request';
import { ExcessIncomeUpdateTovCommentRequest } from '@app/core/models/excess-income/excess-income-update-tov-comment-request';
import { ExcessIncomeData } from '@app/core/models/excess-income/excess-income-data';

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

	public getGroup(
		request: ExcessIncomeGroupRequest,
	): Observable<ExcessIncomeData<IResponse<ExcessIncomeFromBackendGroup>>> {
		return this.apiService.getGroup(request);
	}

	public getTov(
		request: ExcessIncomeTovRequest,
	): Observable<ExcessIncomeData<IResponse<ExcessIncomeTovFromBackend>>> {
		return this.apiService.getTov(request);
	}

	public getCurrency(): Observable<IResponse<IDictionaryItemDto>> {
		return this.apiService.getCurrency();
	}

	public updateSndClient(clientId: number, request: ExcessIncomeUpdateClientRequest) {
		return this.apiService.updateSndClient(clientId, request);
	}

	public updateSndTovGroups(clientId: number, request: ExcessIncomeUpdateGroupRequest) {
		return this.apiService.updateSndGroup(clientId, request);
	}

	public updateSndTov(request: ExcessIncomeUpdateTovRequest) {
		return this.apiService.updateSndTov(request);
	}

	public updateSndTovComment(request: ExcessIncomeUpdateTovCommentRequest) {
		return this.apiService.updateSndTovComment(request);
	}
}
