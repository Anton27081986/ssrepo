import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { ExcessIncomeTovGroupHistory } from '@app/core/models/excess-income/excess-income-tov-group-history';
import { ExccessIncomeCommentsHistory } from '@app/core/models/excess-income/exccess-income-comments-history';
import { ExcessIncomeSalesHistory } from '@app/core/models/excess-income/excess-income-sales-history';
import { ExcessIncomeData } from '@app/core/models/excess-income/excess-income-data';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeApiService {
	constructor(private readonly http: HttpClient) {}

	public getClients(
		request: ExcessIncomeClientRequest,
	): Observable<IResponse<ExcessIncomeData<ExcessIncomeClient>>> {
		return this.http.post<IResponse<ExcessIncomeData<ExcessIncomeClient>>>(
			`${environment.apiUrl}/api/company/Snd/search`,
			request,
		);
	}

	getGroup(request: ExcessIncomeGroupRequest) {
		return this.http.post<
			ExcessIncomeData<IResponse<ExcessIncomeFromBackendGroup>>
		>(`${environment.apiUrl}/api/company/Snd/groups`, request);
	}

	getTov(request: ExcessIncomeTovRequest) {
		return this.http.post<
			ExcessIncomeData<IResponse<ExcessIncomeTovFromBackend>>
		>(`${environment.apiUrl}/api/company/Snd/tovs`, request);
	}

	public getCurrency(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/Currency`,
		);
	}

	public updateSndClient(
		clientId: number,
		request: ExcessIncomeUpdateClientRequest,
	) {
		return this.http.put<IResponse<ExcessIncomeClient>>(
			`${environment.apiUrl}/api/company/Snd/clients/${clientId}`,
			request,
		);
	}

	public updateSndGroup(
		clientId: number,
		request: ExcessIncomeUpdateGroupRequest,
	) {
		return this.http.put<ExcessIncomeFromBackendGroup>(
			`${environment.apiUrl}/api/company/Snd/clients/${clientId}/group`,
			request,
		);
	}

	public updateSndTov(request: ExcessIncomeUpdateTovRequest) {
		return this.http.put<ExcessIncomeTovFromBackend>(
			`${environment.apiUrl}/api/company/Snd/tovs`,
			request,
		);
	}

	public updateSndTovComment(request: ExcessIncomeUpdateTovCommentRequest) {
		return this.http.post<{ comment: string }>(
			`${environment.apiUrl}/api/company/Snd/comments`,
			request,
		);
	}

	public getTovGroupHistory(
		clientId: number,
		tovGroupId: number,
		limit: number,
		offset: number,
	): Observable<ExcessIncomeTovGroupHistory> {
		return this.http.post<ExcessIncomeTovGroupHistory>(
			`${environment.apiUrl}/api/company/Snd/history`,
			{
				clientId,
				tovGroupId,
				limit,
				offset,
			},
		);
	}

	public getTovHistory(
		objectId: string,
		limit: number,
		offset: number,
	): Observable<IResponse<IChangeTrackerItemDto>> {
		let params = new HttpParams();

		params = params.set('ObjectId', objectId);
		params = params.set('Type', '3');
		params = params.set('limit', limit);
		params = params.set('offset', offset);

		return this.http.get<IResponse<IChangeTrackerItemDto>>(
			`${environment.apiUrl}/api/change-tracker/history`,
			{ params },
		);
	}

	public getCommentsHistory(
		clientId: number,
		tovId: number,
		contractorId: number | null,
		limit: number,
		offset: number,
	): Observable<IResponse<ExccessIncomeCommentsHistory>> {
		return this.http.post<IResponse<ExccessIncomeCommentsHistory>>(
			`${environment.apiUrl}/api/company/Snd/comments/history`,
			{
				clientId,
				tovId,
				contractorId,
				limit,
				offset,
			},
		);
	}

	public getSalesHistory(
		clientId: number | undefined | null,
		tovId: number,
		limit: number,
		offset: number,
	): Observable<IResponse<ExcessIncomeSalesHistory>> {
		let params = new HttpParams();

		if (limit !== null && limit !== undefined) {
			params = params.set('limit', limit);
		}

		if (offset !== null && offset !== undefined) {
			params = params.set('offset', offset);
		}

		return this.http.get<IResponse<ExcessIncomeSalesHistory>>(
			`${environment.apiUrl}/api/company/Snd/clients/${clientId}/tovs/${tovId}/sales`,
			{ params },
		);
	}
}
