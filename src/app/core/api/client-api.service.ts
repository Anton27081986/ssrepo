import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IClientDto } from '@app/core/models/company/client-dto';
import { IClientStatus } from '@app/core/models/company/client-status';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';
import { IContractorItemDto } from '@app/core/models/company/contractor-item-dto';
import {IClientEditRequest} from "@app/core/models/company/client-edit-request";

@Injectable({
	providedIn: 'root',
})
export class ClientApiService {
	public constructor(private readonly http: HttpClient) {}

	public getClients(filter: IClientsFilter) {
		const params = new HttpParams();

		if (filter.code) {
			params.set('code', filter.code.toString());
		}

		if (filter.name) {
			params.set('name', filter.name.toString());
		}

		if (filter.categoryId) {
			params.set('categoryId', filter.categoryId.toString());
		}

		if (filter.contactorId) {
			params.set('contactorId', filter.contactorId.toString());
		}

		if (filter.managerId) {
			params.set('managerId', filter.managerId.toString());
		}

		if (filter.status) {
			params.set('status', filter.status.toString());
		}

		if (filter.withoutBaseManager) {
			params.set('withoutBaseManager', filter.withoutBaseManager.toString());
		}

		if (filter.limit) {
			params.set('limit', filter.limit.toString());
		}

		if (filter.offset) {
			params.set('offset', filter.offset.toString());
		}

		return this.http.get<IResponse<IClientItemDto>>(
			`${environment.apiUrl}/api/company/clients`,
			{ params },
		);
	}

	public getClientCardById(id: number): Observable<IClientDto> {
		return this.http.get<IClientDto>(`${environment.apiUrl}/api/company/clients/${id}`);
	}

	public getManagers(id: number): Observable<IManagerItemDto[]> {
		return this.http.get<IManagerItemDto[]>(
			`${environment.apiUrl}/api/company/clients/${id}/managers`,
		);
	}

	public getContractors(id: number, isActiveOnly: boolean): Observable<IContractorItemDto[]> {
		return this.http.get<IContractorItemDto[]>(
			`${environment.apiUrl}/api/company/clients/${id}/contractors`,
			{
				params: new HttpParams().set('isActiveOnly', isActiveOnly),
			},
		);
	}

	public getRegions(searchTerm: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/regions`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}

	public getCategories(searchTerm?: string | null) {
		const params = new HttpParams();

		if (searchTerm) {
			params.set('query', searchTerm.toString());
		}

		return this.http.get<IDictionaryItemDto[]>(
			`${environment.apiUrl}/api/company/clients/categories`,
			{
				params,
			},
		);
	}

	public getSubSectors(searchTerm: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/subsectors`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}

	public setBasicManager(clientId: number, managerId: number) {
		return this.http.put<IManagerItemDto>(
			`${environment.apiUrl}/api/company/clients/${clientId}/managers/${managerId}`,
			{},
		);
	}

	public addManager(clientId: number, userId: number) {
		return this.http.post<IManagerItemDto>(
			`${environment.apiUrl}/api/company/clients/${clientId}/managers`,
			{ userId, isMain: false },
		);
	}

	public deleteManager(clientId: number, managerId: number) {
		return this.http.delete<IManagerItemDto>(
			`${environment.apiUrl}/api/company/clients/${clientId}/managers/${managerId}`
		);
	}

	public saveInfo(clientId: number, body: IClientEditRequest) {
		return this.http.put<IManagerItemDto>(
			`${environment.apiUrl}/api/company/clients/${clientId}`,
			body,
		);
	}
}
