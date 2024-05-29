import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Injectable({
	providedIn: 'root',
})
export class DictionaryApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Список категорий клиентов */
	public getCategories(query?: string): Observable<IResponse<{ id: number; name: string }>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/company/dictionary/categories`,
			{
				params,
			},
		);
	}

	/** Список контрагентов */
	public getContractors(
		query?: string,
		clientId?: number,
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (clientId !== null && clientId !== undefined) {
			params = params.set('clientId', clientId);
		}

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/contractors`,
			{
				params,
			},
		);
	}

	/** Список статусов */
	public getStatuses(): Observable<IResponse<{ id: number; name: string }>> {
		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/company/dictionary/clientStatuses`,
		);
	}

	/** Список товаров */
	public getTovs(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/tovs`,
			{ params },
		);
	}

	public getTechnologist(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/users/search`,
			{ params },
		);
	}
}
