import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IClientDataDto } from '@app/core/models/company/client-dto';
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
		return this.http.post<IResponse<IClientItemDto>>(
			`${environment.apiUrl}/api/company/clients`,
			filter,
		);
	}

	public getClientCardById(id: number): Observable<IClientDataDto> {
		return this.http.get<IClientDataDto>(`${environment.apiUrl}/api/company/clients/${id}`);
	}

	public getManagers(id: number): Observable<IManagerItemDto[]> {
		return this.http.get<IManagerItemDto[]>(
			`${environment.apiUrl}/api/company/clients/${id}/managers`,
		);
	}

	public getClientStatuses(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/clientStatuses`,
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

	public getClientsDictionary(
		searchTerm: string,
		onlyActive: boolean,
		onlyUserClients: boolean,
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		params = params.set('query', searchTerm);

		params = params.set('onlyActive', onlyActive);

		params = params.set('onlyUserClients', onlyUserClients);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/clients`,
			{
				params,
			},
		);
	}

	public getClientIdDictionary(id: number): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/clients/${id}`,
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
				comments: body.comments,
			},
		);
	}
}
