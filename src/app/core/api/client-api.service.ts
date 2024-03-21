import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IClientDto } from '@app/core/models/company/client-dto';
import { IClientStatus } from '@app/core/models/company/client-status';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ClientApiService {
	public constructor(private readonly http: HttpClient) {}

	public getClients(
		code?: number,
		name?: string,
		categoryId?: number,
		contactorId?: number,
		managerId?: number,
		status?: IClientStatus,
		withoutBaseManager?: boolean,
		limit?: number,
		offset?: number,
	) {
		const params = new HttpParams();

		if (code) {
			params.set('code', code.toString());
		}

		if (name) {
			params.set('name', name.toString());
		}

		if (categoryId) {
			params.set('categoryId', categoryId.toString());
		}

		if (contactorId) {
			params.set('contactorId', contactorId.toString());
		}

		if (managerId) {
			params.set('managerId', managerId.toString());
		}

		if (status) {
			params.set('status', status.toString());
		}

		if (withoutBaseManager) {
			params.set('withoutBaseManager', withoutBaseManager.toString());
		}

		if (limit) {
			params.set('limit', limit.toString());
		}

		if (offset) {
			params.set('offset', offset.toString());
		}

		return this.http.get<IResponse<IClientItemDto>>(
			`${environment.apiUrl}/api/company/clients`,
			{ params },
		);
	}

	public getClientCardById(id: number): Observable<IClientDto> {
		return this.http.get<IClientDto>(`${environment.apiUrl}/api/company/client/${id}`, {
			params: new HttpParams().set('id', id),
		});
	}

	public updateClientCard() {}

	public addManager() {}

	public deleteManager() {}

	public setMainManager() {}

	public getContractors(searchTerm: string) {
		return this.http.get<IDictionaryItemDto[]>(
			`${environment.apiUrl}/api/company/clients/contractors`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}

	public getRegions(searchTerm: string) {
		return this.http.get<IDictionaryItemDto[]>(
			`${environment.apiUrl}/api/company/clients/regions`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}

	public getCategories(searchTerm: string) {
		return this.http.get<IDictionaryItemDto[]>(
			`${environment.apiUrl}/api/company/clients/categories`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}

	public getSubSectors(searchTerm: string) {
		return this.http.get<IDictionaryItemDto[]>(
			`${environment.apiUrl}/api/company/clients/subsectors`,
			{
				params: new HttpParams().set('query', searchTerm),
			},
		);
	}
}
