import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { IAddSpecification } from '@app/core/models/completed-work-acts/add-specification';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';

@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsApiService {
	constructor(private readonly http: HttpClient) {}
	public getWorkActsList(
		filters: ICompletedActsFilter,
	): Observable<IResponse<ICompletedWorkAct>> {
		let params = new HttpParams();

		if (filters.limit !== null && filters.limit !== undefined) {
			params = params.set('limit', filters.limit);
		}

		if (filters.offset !== null && filters.offset !== undefined) {
			params = params.set('offset', filters.offset);
		}

		if (filters.DateFrom !== null && filters.DateFrom !== undefined) {
			params = params.set('DateFrom', filters.DateFrom);
		}

		if (filters.DateTo !== null && filters.DateTo !== undefined) {
			params = params.set('DateTo', filters.DateTo);
		}

		if (filters.Id !== null && filters.Id !== undefined) {
			params = params.set('Id', filters.Id);
		}

		if (filters.BuUnitId !== null && filters.BuUnitId !== undefined) {
			params = params.set('BuUnitId', filters.BuUnitId);
		}

		if (filters.State !== null && filters.State !== undefined) {
			filters.State.forEach((state) => {
				params = params.append('State', state);
			});
		}

		if (
			filters.ProviderContractorId !== null &&
			filters.ProviderContractorId !== undefined
		) {
			params = params.set(
				'ProviderContractorId',
				filters.ProviderContractorId,
			);
		}

		if (
			filters.ApplicantUserId !== null &&
			filters.ApplicantUserId !== undefined
		) {
			params = params.set('ApplicantUserId', filters.ApplicantUserId);
		}

		if (filters.TotalAmount !== null && filters.TotalAmount !== undefined) {
			params = params.set('TotalAmount', filters.TotalAmount);
		}

		if (filters.Additional !== null && filters.Additional !== undefined) {
			params = params.set('Additional', filters.Additional ? 1 : 0);
		}

		if (filters.WithArchive !== null && filters.WithArchive !== undefined) {
			params = params.set('WithArchive', filters.WithArchive);
		}

		return this.http.get<IResponse<ICompletedWorkAct>>(
			`${environment.apiUrl}/api/company/CompletedWorkActs`,
			{ params },
		);
	}

	public getWorkAct(
		id: string,
	): Observable<{ data: ICompletedWorkAct; permissions: string[] }> {
		return this.http.get<{
			data: ICompletedWorkAct;
			permissions: string[];
		}>(`${environment.apiUrl}/api/company/CompletedWorkActs/${id}`);
	}

	public updateAct(
		actId: number,
		body: IUpdateAct,
	): Observable<ICompletedWorkAct> {
		return this.http.put<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}`,
			body,
		);
	}

	public getSpecifications(id: string): Observable<{
		totalAmount: number;
		items: ICompletedWorkActSpecification[];
	}> {
		return this.http.get<{
			totalAmount: number;
			items: ICompletedWorkActSpecification[];
		}>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${id}/CostDetails`,
		);
	}

	public addSpecification(
		actId: number,
		body: IAddSpecification,
	): Observable<ICompletedWorkActSpecification> {
		return this.http.post<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			body,
		);
	}

	public updateSpecification(
		actId: number,
		body: IAddSpecification,
	): Observable<ICompletedWorkActSpecification> {
		return this.http.put<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			body,
		);
	}

	public deleteSpecification(
		actId: number,
		costDetailId: number,
	): Observable<ICompletedWorkActSpecification> {
		let params = new HttpParams();

		if (costDetailId !== null && costDetailId !== undefined) {
			params = params.set('costDetailId', costDetailId);
		}

		return this.http.delete<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			{
				params,
			},
		);
	}

	public getActStates(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/CompletedWorkActStates`,
		);
	}

	public getCurrencies(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Currency`,
		);
	}

	public getBuUnits(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/BuUnits`,
		);
	}

	public toArchiveAct(actId: number): Observable<any> {
		return this.http.post<any>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Delete`,
			{},
		);
	}

	public pullAct(actId: number): Observable<any> {
		return this.http.post<any>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Pull`,
			{},
		);
	}

	public restoreAct(actId: number): Observable<any> {
		return this.http.post<any>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Restore`,
			{},
		);
	}

	public addDocumentToAct(
		actId: number,
		documentId: string,
	): Observable<string> {
		return this.http.post<string>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Document`,
			`"${documentId}"`,
			{
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				}),
			},
		);
	}

	public removeDocumentFromAct(
		actId: number,
		documentId: string,
	): Observable<string> {
		return this.http.delete<string>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Document/${documentId}`,
		);
	}
}
