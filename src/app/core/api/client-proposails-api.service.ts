import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import {
	delay,
	delayWhen,
	EMPTY,
	expand,
	interval,
	last,
	map,
	Observable,
	of,
	retryWhen,
	switchMap,
	tap,
	throwError,
} from 'rxjs';
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
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';

export interface IFile {
	id: number;
	type: number;
	url: string;
}

export interface IShareFile {
	files: IFile[];
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

	public getDoneProductions(clientId: number): Observable<IResponse<ProposalsProduction>> {
		return this.http.get<IResponse<ProposalsProduction>>(
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

		return this.http.get<IResponse<IClientOffersDto>>(
			`${environment.apiUrl}/api/company/ClientProposals/clientOffers`,
			{
				params: httpParams,
			},
		);
	}

	public saveInCloud(files: IFilesProposals[]): Observable<SaveInCloud> {
		const request: IFile[] = files.map(file => {
			return {
				id: file.id,
				type: file.type,
				url: file.url,
			};
		});

		const dataRequest: IShareFile = { files: request };

		return this.http.post<SaveInCloud>(`${environment.apiUrl}/api/files/share`, dataRequest);
	}
	// Есть проблемы  с скачиванием пока оставлю
	public getFiles(url: string): Observable<HttpResponse<Blob>> {
		return this.http.get<Blob>(url, { observe: 'response' }).pipe(
			expand((response: HttpResponse<Blob>) => {
				if (response.status === 202) {
					// Wait for 5 seconds before making another request
					return this.http.get<Blob>(url, { observe: 'response' }).pipe(delay(3000));
				} else {
					// Stop the recursion by returning an empty observable
					return EMPTY;
				}
			}),
			//last(),
			catchError(error => {
				console.error('Error fetching files:', error);

				return throwError(() => new Error('Error fetching files'));
			}),
		);
	}
}
