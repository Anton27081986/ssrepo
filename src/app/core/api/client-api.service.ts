import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IClientDto } from '@app/core/models/company/client-dto';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';
import { IContractorItemDto } from '@app/core/models/company/contractor-item-dto';
import { IClientEditRequest } from '@app/core/models/company/client-edit-request';

@Injectable({
	providedIn: 'root',
})
export class ClientApiService {
	public constructor(private readonly http: HttpClient) {}

	public getClients(filter: IClientsFilter) {
		let params = new HttpParams();

		if (filter.code !== null && filter.code !== undefined) {
			params = params.set('code', filter.code);
		}

		if (filter.name !== null && filter.name !== undefined) {
			params = params.set('name', filter.name);
		}

		if (filter.categoryId !== null && filter.categoryId !== undefined) {
			params = params.set('categoryId', filter.categoryId);
		}

		if (filter.contractorId !== null && filter.contractorId !== undefined) {
			params = params.set('contractorId', filter.contractorId);
		}

		if (filter.managerId !== null && filter.managerId !== undefined) {
			params = params.set('managerId', filter.managerId);
		}

		if (filter.status !== null && filter.status !== undefined) {
			params = params.set('status', filter.status);
		}

		if (filter.withoutBaseManager) {
			params = params.set('withoutBaseManager', filter.withoutBaseManager);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
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
			`${environment.apiUrl}/api/company/clients/${clientId}/managers/${managerId}`,
		);
	}

	public saveInfo(clientId: number, body: IClientEditRequest) {
		return this.http.put<IManagerItemDto>(
			`${environment.apiUrl}/api/company/clients/${clientId}`,
			{
				categoryId: body.categoryId,
				name: body.name,
				regionId: body.regionId,
				status: Number(body.status),
				comment: body.comment,
			},
		);
	}
}
