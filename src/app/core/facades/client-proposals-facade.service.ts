import { Injectable } from '@angular/core';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import { filter, map, Observable, OperatorFunction } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ProposalsProduction } from '@app/core/models/client-proposails/proposals-production';
import { INewsDto } from '@app/core/models/client-proposails/news';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { ITradeList } from '@app/core/models/client-proposails/trade-list';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { IRequestGetProposals } from '@app/core/models/client-proposails/request-get-proposals';
import { ActivatedRoute } from '@angular/router';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';
import {
	IClientOffersDto,
	IFilesProposals,
	IRequestGetClientOffer,
} from '@app/core/models/client-proposails/client-offers';
import { SaveInCloud } from '@app/core/models/client-proposails/save-in-cloud';

@Injectable()
export class ClientProposalsFacadeService {
	public clientId$: Observable<number>;

	constructor(
		private readonly clientProposalsApiService: ClientProposalsApiService,
		activatedRoute: ActivatedRoute,
	) {
		this.clientId$ = activatedRoute.paramMap.pipe(
			filterTruthy(),
			map(params => {
				return Number(params.get('clientId'));
			}),
		);
	}

	public getDoneProductionsByClientId(
		clientId: number,
	): Observable<IResponse<ProposalsProduction>> {
		return this.clientProposalsApiService.getDoneProductions(clientId);
	}

	public getNewsByClientId(params: IRequestGetProposals): Observable<IResponse<INewsDto>> {
		return this.clientProposalsApiService.getNews(params);
	}

	public getExamplesByClientId(params: IRequestGetProposals): Observable<IResponse<ISamples>> {
		return this.clientProposalsApiService.getSamples(params);
	}

	public getTradeList(params: IRequestGetProposals): Observable<IResponse<ITradeList>> {
		return this.clientProposalsApiService.getTradeList(params);
	}

	public getTrips(params: IRequestGetProposals): Observable<IResponse<IBusinessTripsDto>> {
		return this.clientProposalsApiService.getTrips(params);
	}

	public getContractors(params: IRequestGetProposals): Observable<IResponse<IContractorsDto>> {
		return this.clientProposalsApiService.getContractors(params);
	}

	public getDevelopment(params: IRequestGetProposals): Observable<IResponse<IDevelopmentDto>> {
		return this.clientProposalsApiService.getCommitteeDevelopments(params);
	}

	public getClientOffers(
		params: IRequestGetClientOffer,
	): Observable<IResponse<IClientOffersDto>> {
		return this.clientProposalsApiService.getClientOffers(params);
	}

	public saveInCloud(files: IFilesProposals[]): Observable<SaveInCloud> {
		return this.clientProposalsApiService.saveInCloud(files);
	}
}

export function filterTruthy<TValue>(): OperatorFunction<TValue | null | undefined, TValue> {
	return filter(src => !!src) as OperatorFunction<TValue | null | undefined, TValue>;
}
