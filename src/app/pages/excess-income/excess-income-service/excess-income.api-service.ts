import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ExcessIncomeGroup } from '@app/core/models/excess-income/excess-income-group';
import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov';
import { ExcessIncomeGroupRequest } from '@app/core/models/excess-income/excess-income-group-request';
import { ExcessIncomeClientRequest } from '@app/core/models/excess-income/excess-income-client-request';
import { ExcessIncomeTovRequest } from '@app/core/models/excess-income/excess-income-tov-request';

@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeApiService {
	constructor(private readonly http: HttpClient) {}

	public getClients(
		request: ExcessIncomeClientRequest,
	): Observable<IResponse<ExcessIncomeClient>> {
		return this.http.post<IResponse<ExcessIncomeClient>>(
			`${environment.apiUrl}/api/company/Snd/search`,
			request,
		);
	}

	getGroup(request: ExcessIncomeGroupRequest) {
		return this.http.post<IResponse<ExcessIncomeGroup>>(
			`${environment.apiUrl}/api/company/Snd/groups`,
			request,
		);
	}

	getTov(request: ExcessIncomeTovRequest) {
		return this.http.post<IResponse<ExcessIncomeTov>>(
			`${environment.apiUrl}/api/company/Snd/tovs`,
			request,
		);
	}

	public getCurrency(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/Currency`,
		);
	}
}
