import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class CompletedWorkActsFiltersApiService {
	private readonly http: HttpClient = inject(HttpClient);

	public getIds(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || '1');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/CompletedWorkActs`,
			{ params }
		);
	}

	public getCostArticles(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || '1');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Dictionary/CostArticles`,
			{ params }
		);
	}

	public getActStates(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || 'а');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/CompletedWorkActStates`
		);
	}

	public getBuUnits(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || 'а');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/BuUnits`,
			{ params }
		);
	}

	public getProviderContractors(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || 'а');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/contractors`,
			{
				params,
			}
		);
	}

	public getApplicantUsers(
		query: string,
		ids: number[] = []
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query || 'а');

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/auth/users/search`,
			{ params }
		);
	}
}
