import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { FilterSectionDto } from '@app/core/models/production-plan/filter-section-dto';

export interface AvatarDictionaryItemDto extends IDictionaryItemDto {
	avatarUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class OperationPlanFiltersApiService {
	private readonly http: HttpClient = inject(HttpClient);

	public getPlanEconomicUser(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<AvatarDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<AvatarDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/PlanEconomicUsers`,
			{ params }
		);
	}

	public getProductManagerUser(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<AvatarDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<AvatarDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/ProductManagerUsers`,
			{ params }
		);
	}

	public getWarehouse(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/Warehouses`,
			{ params }
		);
	}

	public getProductionSection(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<FilterSectionDto> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<FilterSectionDto>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/ProductionSections`,
			{ params }
		);
	}

	public getTov(
		query: string,
		ids: number[] = [],
		weekId: number,
		onlyIds: boolean
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('weekId', weekId);

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/OperationalPlanTovs`,
			{ params }
		);
	}

	public getCities(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/Cities`,
			{ params }
		);
	}

	public getTovCategory(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/TovCategories`,
			{ params }
		);
	}

	public getProductionFactory(
		query: string,
		ids: number[] = [],
		onlyIds: boolean
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams().set('query', query);

		ids.forEach((id) => {
			params = params.append('ids', id.toString());
		});

		params = params.set('onlyIds', onlyIds);

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/ProductionFactories`,
			{ params }
		);
	}
}
