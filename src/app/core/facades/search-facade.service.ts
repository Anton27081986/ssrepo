import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { map, Observable } from 'rxjs';
import { UsersApiService } from '@app/core/api/users-api.service';
import { DictionaryApiService } from '@app/core/api/dictionary-api.service';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { ProductionsApiService } from '@app/core/api/productions-api.service';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IGlobalSearchDto } from '@app/core/models/company/global-search-dto';
import { SearchTypeEnum } from '@app/core/models/search-type';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class SearchFacadeService {
	private clientId: number | null | undefined;

	public constructor(
		private readonly clientApiService: ClientApiService,
		private readonly usersApiService: UsersApiService,
		private readonly dictionaryApiService: DictionaryApiService,
		public readonly clientCardListFacade: ClientsCardFacadeService,
		public readonly productionsApiService: ProductionsApiService,
		public readonly winsApiService: WinsApiService,
		public readonly menuApiService: MenuApiService,
	) {
		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			this.clientId = clientId;
		});
	}

	public getUsers(query: string) {
		return this.usersApiService.getUsersByFIO(query);
	}

	public getRegions(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.clientApiService.getRegions(query);
	}

	public getSubSectors(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.clientApiService.getSubSectors(query);
	}

	public getClients(
		query: string,
		onlyActive: boolean = false,
	): Observable<IResponse<IDictionaryItemDto>> {
		return this.clientApiService.getClientsDictionary(query, onlyActive);
	}

	public getProductions(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.productionsApiService.searchProductions(query);
	}

	public getContractor(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getContractors(query, this.clientId);
	}

	public getTovs(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getTovs(query);
	}

	public getTovGroups(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.productionsApiService.getTpgSearch(query);
	}

	public getTechnologist(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getTechnologist(this.clientId!, query);
	}

	public getClientIdDictionary(id: number): Observable<IResponse<IDictionaryItemDto>> {
		return this.clientApiService.getClientIdDictionary(id);
	}

	public getContracts(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getContracts(query);
	}

	public globalSearch(query: string): Observable<IResponse<IGlobalSearchDto>> {
		return this.menuApiService.globalSearch(query);
	}

	public getProductSearch(query: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.winsApiService.getProductSearch(query);
	}

	public getDictionaryUsers(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.dictionaryApiService.getDictionaryUsers(this.clientId!, query);
	}

	public getSearchMethodByType(
		searchType: SearchTypeEnum,
		query: string,
		isActive = false,
	): Observable<IDictionaryItemDto[]> {
		switch (searchType) {
			case SearchTypeEnum.User:
				return this.getUsers(query).pipe(
					map(data =>
						data.items.map((item: { id: any; fio: any }) => ({
							id: item.id,
							name: item.fio,
						})),
					),
				);

			case SearchTypeEnum.UserDictionary:
				return this.getDictionaryUsers(query).pipe(map(data => data.items));

			case SearchTypeEnum.SubSector:
				return this.getSubSectors(query).pipe(
					map(data =>
						data.items.map((item: { id: any; name: any }) => ({
							id: item.id,
							name: item.name,
						})),
					),
				);

			case SearchTypeEnum.Region:
				return this.getRegions(query).pipe(
					map(data =>
						data.items.map((item: { id: any; name: any }) => ({
							id: item.id,
							name: item.name,
						})),
					),
				);

			case SearchTypeEnum.Contractor:
				return this.getContractor(query).pipe(map(data => data.items));

			case SearchTypeEnum.Tovs:
				return this.getTovs(query).pipe(map(data => data.items));

			case SearchTypeEnum.Technologist:
				return this.getTechnologist(query).pipe(map(data => data.items));

			case SearchTypeEnum.Client:
				return this.getClients(query, isActive).pipe(map(data => data.items));

			case SearchTypeEnum.Contract:
				return this.getContracts(query).pipe(map(data => data.items));

			case SearchTypeEnum.Products:
				return this.getProductSearch(query).pipe(map(data => data.items));

			case SearchTypeEnum.Global:
				return this.globalSearch(query).pipe(
					map(data => {
						return data.items.map(
							item =>
								({
									id: 0,
									name: item.title,
									linkToDetail: item.linkToDetail,
								}) as IDictionaryItemDto,
						);
					}),
				);

			default:
				throw new Error(`Invalid search method type`);
		}
	}
}
