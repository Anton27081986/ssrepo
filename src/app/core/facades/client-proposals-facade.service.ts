import { Injectable } from '@angular/core';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import { BehaviorSubject, filter, map, Observable, OperatorFunction, tap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ProposalsProduction } from '@app/core/models/client-proposails/proposals-production';
import { ActivatedRoute } from '@angular/router';
import {
	IClientOffersDto,
	IFilesProposals,
	IRequestGetClientOffer,
} from '@app/core/models/client-proposails/client-offers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductionsApiService } from '@app/core/api/productions-api.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { IRequestGetProposals } from '@app/core/models/client-proposails/request-get-proposals';
import { ICreateOfferDto } from '@app/core/models/client-proposails/create-offer-dto';
import { SaveInCloud } from '@app/core/models/client-proposails/save-in-cloud';
import { IDevelopmentDto } from '@app/core/models/client-proposails/development';
import { IContractorsDto } from '@app/core/models/client-proposails/contractors';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import { ITradeList } from '@app/core/models/client-proposails/trade-list';
import { ISamples } from '@app/core/models/client-proposails/samples';
import { INewsDto } from '@app/core/models/client-proposails/news';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { IRequestGetTradeList } from '@app/core/models/client-proposails/request-get-trade-list';
import { IRequestGetDevelopment } from '@app/core/models/client-proposails/request-get-development';
import { IRequestGetBusinessTrips } from '@app/core/models/client-proposails/request-get-business-trips';

@UntilDestroy()
@Injectable()
export class ClientProposalsFacadeService {
	public clientId$: Observable<number>;

	public isAlterFilter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public alterFilterDefenitionNote$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private readonly permissionsSubject = new BehaviorSubject<string[]>([]);
	public permissions$ = this.permissionsSubject.asObservable();

	private readonly tprRejectsReasonsSubject = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public tprRejectsReasons$ = this.tprRejectsReasonsSubject.asObservable();

	public readonly blockForProposalSubject$ = new BehaviorSubject<boolean>(false);

	constructor(
		private readonly clientProposalsApiService: ClientProposalsApiService,
		private readonly clientProductionsApiService: ProductionsApiService,
		private readonly dictionaryApiService: DictionaryApiService,
		private readonly permissionService: PermissionsFacadeService,
		private readonly activatedRoute: ActivatedRoute,
	) {
		this.clientId$ = this.activatedRoute.paramMap.pipe(
			filterTruthy(),
			map(params => {
				return Number(params.get('clientId'));
			}),
		);

		this.getTprRejectReasons()
			.pipe(
				untilDestroyed(this),
				tap(val => {
					this.tprRejectsReasonsSubject.next(val.items);
				}),
			)
			.subscribe();
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

	public getTradeList(params: IRequestGetTradeList): Observable<IResponse<ITradeList>> {
		return this.clientProposalsApiService.getTradeList(params);
	}

	public getTrips(params: IRequestGetBusinessTrips): Observable<IResponse<IBusinessTripsDto>> {
		return this.clientProposalsApiService.getTrips(params);
	}

	public getContractors(params: IRequestGetProposals): Observable<IResponse<IContractorsDto>> {
		return this.clientProposalsApiService.getContractors(params);
	}

	public getDevelopment(params: IRequestGetDevelopment): Observable<IResponse<IDevelopmentDto>> {
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

				this.isAlterFilter$.next(items.isAlterFilter!);
				this.alterFilterDefenitionNote$.next(items.alterFilterDefenitionNote!);

				return {
					total: items.total,
					items: data,
					linkToModule: items.linkToModule,
					clientOfferId: items.clientOfferId,
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

	public getTprRejectReasons(): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getTprRejectReasons();
	}

	public saveOffer(offer: ICreateOfferDto) {
		return this.clientProposalsApiService.saveOffer(offer);
	}
}

export function filterTruthy<TValue>(): OperatorFunction<TValue | null | undefined, TValue> {
	return filter(src => !!src) as OperatorFunction<TValue | null | undefined, TValue>;
}
