import { Injectable } from '@angular/core';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import {
	BehaviorSubject,
	filter,
	map,
	Observable,
	OperatorFunction,
	shareReplay,
	switchMap,
	tap,
} from 'rxjs';
import { IResponse, IResponseProposalsTrips } from '@app/core/utils/response';
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
import { IRequestGetTradeList } from '@app/core/models/client-proposails/request-get-trade-list';
import { IRequestGetDevelopment } from '@app/core/models/client-proposails/request-get-development';
import { IRequestGetBusinessTrips } from '@app/core/models/client-proposails/request-get-business-trips';
import { Permissions } from '@app/core/constants/permissions.constants';
import { ResponseProposals } from '@app/core/utils/response-proposals';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientProposalsFacadeService {
	public instructionFileLink =
		'https://erp.ssnab.ru/api/static/general/2024/10/22/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F_%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82_%D1%81_%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%BE%D0%BC_c659ff6b-5fb7-4d31-ba64-9a37d15b3ada.docx';

	public clientId$: Observable<number>;

	public isAlterFilter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public alterFilterDefenitionNote$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	private readonly tprRejectsReasonsSubject = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public tprRejectsReasons$ = this.tprRejectsReasonsSubject.asObservable();

	public readonly blockForProposalSubject$ = new BehaviorSubject<boolean>(false);

	public doneProductions$: Observable<{
		data: IResponse<ProposalsProduction>;
		permissions: string[];
	}>;

	public readonly proposalsPermissions$: Observable<string[]>;

	get canTakeWork(): Observable<boolean> {
		return this.proposalsPermissions$.pipe(
			map(permission => {
				return permission.includes(Permissions.CLIENT_PROPOSALS_CAN_TAKE_IN_WORK);
			}),
		);
	}

	constructor(
		private readonly clientProposalsApiService: ClientProposalsApiService,
		private readonly clientProductionsApiService: ProductionsApiService,
		private readonly dictionaryApiService: DictionaryApiService,
		activatedRoute: ActivatedRoute,
	) {
		this.clientId$ = activatedRoute.paramMap.pipe(
			filterTruthy(),
			map(params => {
				return Number(params.get('clientId'));
			}),
		);

		this.doneProductions$ = this.clientId$.pipe(
			filterTruthy(),
			switchMap(id => {
				return this.getDoneProductionsByClientId(id);
			}),
			shareReplay({
				refCount: true,
				bufferSize: 1,
			}),
		);

		this.proposalsPermissions$ = this.doneProductions$.pipe(
			map(productions => {
				return productions.permissions;
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
		return this.clientProposalsApiService.getDoneProductions(clientId);
	}

	public getNewsByClientId(params: IRequestGetProposals): Observable<IResponse<INewsDto>> {
		return this.clientProposalsApiService.getNews(params);
	}

	public getExamplesByClientId(
		params: IRequestGetProposals,
	): Observable<IResponseProposalsTrips<ISamples>> {
		return this.clientProposalsApiService.getSamples(params);
	}

	public getTradeList(params: IRequestGetTradeList): Observable<IResponse<ITradeList>> {
		return this.clientProposalsApiService.getTradeList(params);
	}

	public getTrips(
		params: IRequestGetBusinessTrips,
	): Observable<IResponseProposalsTrips<IBusinessTripsDto>> {
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
	): Observable<ResponseProposals<IClientOffersDto>> {
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

				this.isAlterFilter$.next(items.isAlterFilter);
				this.alterFilterDefenitionNote$.next(items.alterFilterDefenitionNote!);

				return {
					total: items.total,
					items: data,
					isAlterFilter: items.isAlterFilter,
					alterFilterDefenitionNote: items.alterFilterDefenitionNote,
					alterSearch: items.alterSearch,
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
