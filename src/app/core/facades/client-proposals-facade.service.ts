import { Injectable } from '@angular/core';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import { BehaviorSubject, filter, map, Observable, OperatorFunction, tap } from 'rxjs';
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
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProductionsApiService } from '@app/core/api/productions-api.service';

@UntilDestroy()
@Injectable()
export class ClientProposalsFacadeService {
	public clientId$: Observable<number>;

	private readonly permissionsSubject = new BehaviorSubject<string[]>([]);
	public permissions$ = this.permissionsSubject.asObservable();

	constructor(
		private readonly clientProposalsApiService: ClientProposalsApiService,
		private readonly clientProductionsApiService: ProductionsApiService,
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
	): Observable<{ data: IResponse<ProposalsProduction>; permissions: string[] }> {
		return this.clientProposalsApiService
			.getDoneProductions(clientId)
			.pipe(tap(res => this.permissionsSubject.next(res.permissions)));
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
		return this.clientProposalsApiService.getClientOffers(params).pipe(
			map(items => {
				const data = items.items;

				data.forEach(item => {
					if (item.documents) {
						item.documents.forEach(doc => {
							doc.checked = false;
							doc.uniqId = this.generateRandomString(10);
						});
					}

					if (item.promotionalMaterials) {
						item.promotionalMaterials.forEach(doc => {
							doc.checked = false;
							doc.uniqId = this.generateRandomString(10);
						});
					}
				});

				return {
					total: items.total,
					items: data,
					linkToModule: items.linkToModule,
				};
			}),
		);
	}

	public getProduction(query: string) {
		return this.clientProductionsApiService.searchProductions(query);
	}

	public getTgSearch(query: string) {
		return this.clientProductionsApiService.getTgSearch(query);
	}

	public getTpgSearch(query: string) {
		return this.clientProductionsApiService.getTpgSearch(query);
	}

	public getSignVgpSearch() {
		return this.clientProductionsApiService.getSignSearch();
	}

	public generateRandomString(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	public saveInCloud(files: IFilesProposals[], sendEmail: boolean): Observable<SaveInCloud> {
		return this.clientProposalsApiService.saveInCloud(files, sendEmail);
	}

	public getFiles(url: string): Observable<Blob> {
		return this.clientProposalsApiService.getFiles(url);
	}
}

export function filterTruthy<TValue>(): OperatorFunction<TValue | null | undefined, TValue> {
	return filter(src => !!src) as OperatorFunction<TValue | null | undefined, TValue>;
}
