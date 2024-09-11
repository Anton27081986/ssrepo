import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { map, Observable, retryWhen, switchMap, throwError, timer } from 'rxjs';
import { ProposalsProduction } from '@app/core/models/client-proposails/proposals-production';
import { IResponse } from '@app/core/utils/response';
import { INewsDto } from '@app/core/models/client-proposails/news';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { ITradeList } from '@app/core/models/client-proposails/trade-list';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { IRequestGetProposals } from '@app/core/models/client-proposails/request-get-proposals';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';
import {
	IClientOffersDto,
	IFilesProposals,
	IRequestGetClientOffer,
} from '@app/core/models/client-proposails/client-offers';
import { SaveInCloud } from '@app/core/models/client-proposails/save-in-cloud';
import { catchError } from 'rxjs/operators';
import { ICreateOfferDto } from '@app/core/models/client-proposails/create-offer-dto';
import { TypeReportEnum } from '@app/pages/client-proposals-page/client-proposals-page/client-proposals-page.component';

export interface IFile {
	id: number;
	type: number;
	url: string;
}

export interface IShareFile {
	files: IFile[];
	sendEmail: boolean;
}

export interface ILoadFileStatus {
	blob: Observable<Blob>;
	isLoad: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class ClientProposalsApiService {
	// заготовка для таблиц в аккордионе
	public constructor(private readonly http: HttpClient) {}

	public getDoneProductions(
		clientId: number,
	): Observable<{ data: IResponse<ProposalsProduction>; permissions: string[] }> {
		return this.http.get<{ data: IResponse<ProposalsProduction>; permissions: string[] }>(
			`${environment.apiUrl}/api/company/ClientProposals/doneProductions/${clientId}`,
		);
	}

	public getNews(params: IRequestGetProposals): Observable<IResponse<INewsDto>> {
		return this.http.get<IResponse<INewsDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/news`,
			{
				params: new HttpParams()
					.set('clientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getTrips(params: IRequestGetProposals): Observable<IResponse<IBusinessTripsDto>> {
		return this.http.get<IResponse<IBusinessTripsDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/trips`,
			{
				params: new HttpParams()
					.set('clientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getTradeList(params: IRequestGetProposals): Observable<IResponse<ITradeList>> {
		return this.http.get<IResponse<ITradeList>>(
			`${environment.apiUrl}/api/company/ClientProposals/productSheets`,
			{
				params: new HttpParams()
					.set('clientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getContractors(params: IRequestGetProposals): Observable<IResponse<IContractorsDto>> {
		return this.http.get<IResponse<IContractorsDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/contractors`,
			{
				params: new HttpParams()
					.set('ClientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset)
					.set('WithArchived', params.withArchiver!),
			},
		);
	}

	public getSamples(params: IRequestGetProposals): Observable<IResponse<ISamples>> {
		return this.http.get<IResponse<ISamples>>(
			`${environment.apiUrl}/api/company/ClientProposals/samples`,
			{
				params: new HttpParams()
					.set('clientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getCommitteeDevelopments(
		params: IRequestGetProposals,
	): Observable<IResponse<IDevelopmentDto>> {
		return this.http.get<IResponse<IDevelopmentDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/CommitteeDevelopments`,
			{
				params: new HttpParams()
					.set('clientId', params.clientId)
					.set('Limit', params.limit)
					.set('Offset', params.offset),
			},
		);
	}

	public getClientOffers(
		params: IRequestGetClientOffer,
	): Observable<IResponse<IClientOffersDto>> {
		let httpParams = new HttpParams();

		httpParams = httpParams.set('clientId', params.clientId);

		params.productionIds.forEach((id, index) => {
			if (index === 0) {
				httpParams = httpParams.set('ProductionIds', id);
			} else {
				httpParams = httpParams.append('ProductionIds', id);
			}
		});

		params.TprFlags.forEach((id, index) => {
			if (index === 0) {
				httpParams = httpParams.set('TprFlags', id);
			} else {
				httpParams = httpParams.append('TprFlags', id);
			}
		});

		params.TovGroups.forEach((id, index) => {
			if (index === 0) {
				httpParams = httpParams.set('TovGroups', id);
			} else {
				httpParams = httpParams.append('TovGroups', id);
			}
		});

		return this.http.get<IResponse<IClientOffersDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/clientOffers`,
			{
				params: httpParams,
			},
		);
	}

	public saveInCloud(files: IFilesProposals[], sendEmail: boolean): Observable<SaveInCloud> {
		const request: IFile[] = files.map(file => {
			return {
				id: file.id,
				type: file.type,
				url: file.url,
			};
		});

		const dataRequest: IShareFile = { files: request, sendEmail };

		return this.http.post<SaveInCloud>(`${environment.apiUrl}/api/files/share`, dataRequest);
	}

	public getFiles(url: string): Observable<Blob> {
		return this.http
			.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json' })
			.pipe(
				map(response => this.handleResponse(response)),
				retryWhen(errors =>
					errors.pipe(
						switchMap(error => {
							if (error.status !== 200) {
								console.log('Retrying request...');

								return timer(3000); // Повторная попытка через 1 секунду
							}

							return throwError(error);
						}),
					),
				),
				catchError(this.handleError),
			);
	}

	public saveOffer(body: ICreateOfferDto): Observable<ICreateOfferDto> {
		return this.http.post<ICreateOfferDto>(
			`${environment.apiUrl}/api/ClientProposals/clientOffers`,
			body,
		);
	}

	public downloadReport(type: TypeReportEnum): Observable<Blob> {
		return this.http.get<Blob>(`${environment.apiUrl}/api/company/ClientProposals/reports`, {
			responseType: 'blob' as 'json',
			headers: new HttpHeaders().append('Content-Type', 'application/json'),
			params: new HttpParams().set('report', type),
		});
	}

	private handleResponse(response: HttpResponse<Blob>): Blob {
		if (response.status === 200 && response.body) {
			return response.body;
		}

		throw new Error(`Unexpected response status: ${response.status}`);
	}

	private handleError(error: any): Observable<never> {
		console.error('Error fetching file from S3:', error);

		return throwError(() => new Error('Error fetching file from S3'));
	}
}
