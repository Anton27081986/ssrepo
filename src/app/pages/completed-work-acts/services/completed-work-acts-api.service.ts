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
import { Pagination } from '@app/core/models/production-plan/operation-plan';

@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsApiService {
	constructor(private readonly http: HttpClient) {}
	public getWorkActsList(
		request: ICompletedActsFilter & Pagination
	): Observable<IResponse<ICompletedWorkAct>> {
		return this.http.post<IResponse<ICompletedWorkAct>>(
			`${environment.apiUrl}/api/company/CompletedWorkActs`,
			request
		);
	}

	public getWorkAct(
		id: string
	): Observable<{ data: ICompletedWorkAct; permissions: string[] }> {
		return this.http.get<{
			data: ICompletedWorkAct;
			permissions: string[];
		}>(`${environment.apiUrl}/api/company/CompletedWorkActs/${id}`);
	}

	public updateAct(
		actId: number,
		body: IUpdateAct
	): Observable<ICompletedWorkAct> {
		return this.http.put<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}`,
			body
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
			`${environment.apiUrl}/api/company/CompletedWorkActs/${id}/CostDetails`
		);
	}

	public addSpecification(
		actId: number,
		body: IAddSpecification
	): Observable<ICompletedWorkActSpecification> {
		return this.http.post<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			body
		);
	}

	public updateSpecification(
		actId: number,
		body: IAddSpecification
	): Observable<ICompletedWorkActSpecification> {
		return this.http.put<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			body
		);
	}

	public deleteSpecification(
		actId: number,
		costDetailId: number
	): Observable<ICompletedWorkActSpecification> {
		let params = new HttpParams();

		if (costDetailId !== null && costDetailId !== undefined) {
			params = params.set('costDetailId', costDetailId);
		}

		return this.http.delete<ICompletedWorkActSpecification>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/CostDetails`,
			{
				params,
			}
		);
	}

	public getActStates(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/CompletedWorkActStates`
		);
	}

	public getCurrencies(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Currency`
		);
	}

	public getBuUnits(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/BuUnits`
		);
	}

	public toArchiveAct(actId: number): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Delete`,
			{}
		);
	}

	public pullAct(actId: number): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Pull`,
			{}
		);
	}

	public restoreAct(actId: number): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/Restore`,
			{}
		);
	}

	public sendActToAdmin(actId: number): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/SendToAdmin`,
			{}
		);
	}

	public sendActToApplicant(
		actId: number,
		comment: string
	): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/SendToApplicant`,
			{ comment }
		);
	}

	public returnActToApplicant(
		actId: number,
		comment: string
	): Observable<ICompletedWorkAct> {
		return this.http.post<ICompletedWorkAct>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Action/ReturnBackToApplicant`,
			{ comment }
		);
	}

	public addDocumentToAct(
		actId: number,
		documentId: string
	): Observable<string> {
		return this.http.post<string>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Document`,
			`"${documentId}"`,
			{
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				}),
			}
		);
	}

	public removeDocumentFromAct(
		actId: number,
		documentId: string
	): Observable<string> {
		return this.http.delete<string>(
			`${environment.apiUrl}/api/company/CompletedWorkActs/${actId}/Document/${documentId}`
		);
	}

	public downloadReport(
		body: (ICompletedActsFilter & Pagination) | null
	): Observable<Blob> {
		return this.http.post(
			`${environment.apiUrl}/api/company/CompletedWorkActs/reports`,
			body,
			{
				responseType: 'blob',
			}
		);
	}
}
