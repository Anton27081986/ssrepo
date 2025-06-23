import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/production-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanPatch,
} from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import { AddToVRequest } from '@app/core/models/production-plan/add-tov-request';
import {
	OperationPlanItems,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';

@Injectable({ providedIn: 'root' })
export class OperationPlanApiService {
	private http: HttpClient = inject(HttpClient);

	public getOperationPlan(
		request: OperationPlanRequest & Pagination,
	): Observable<IResponse<OperationPlanItems>> {
		let params = new HttpParams();
		params = params.set('weekId', 300);
		params = params.set(
			'planEconomicUserIds',
			request.planEconomicUserId ?? null,
		);
		params = params.set(
			'productManagerUserId',
			request.productManagerUserId ?? null,
		);
		params = params.set('warehouseId', request.warehouseId ?? null);
		params = params.set(
			'productionSectionId',
			request.productionSectionId ?? null,
		);
		params = params.set('tovId', request.tovId ?? null);
		params = params.set('cityId', request.cityId ?? null);
		params = params.set('tovCategoryId', request.tovCategoryId ?? null);
		params = params.set('tovCategoryId', request.tovCategoryId ?? null);
		params = params.set(
			'productionFactoryId',
			request.productionFactoryId ?? null,
		);
		params = params.set('Additional', request.additional ?? null);
		params = params.set('limit', request.limit ?? null);
		params = params.set('offset', request.offset ?? null);

		return this.http.get<IResponse<OperationPlanItems>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan`,
			{ params },
		);
	}

	public getTransferProductionPlan(id: number) {
		return this.http.get<IResponse<TransferProductionPlanFromBackend>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan/TransferProductionPlan`,
		);
	}

	public downloadExel(): Observable<Blob> {
		return this.http.get<Blob>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan/Action/Reports`,
		);
	}

	public getWeeks(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/Weeks`,
		);
	}

	public getManufacturingTov(
		query: string,
		limit: number,
		offset: number,
	): Observable<IResponse<ManufacturingTovs>> {
		let params = new HttpParams();

		params = params.set('name', query);
		params = params.set('limit', limit);
		params = params.set('offset', offset);
		return this.http.get<IResponse<ManufacturingTovs>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan/Tovs`,
			{ params },
		);
	}

	public transferProductionPlan(
		params: TransferProductionPlanPatch[],
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan/TransferProductionPlan`,
			params,
		);
	}

	public addGp(params: AddToVRequest[]): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan`,
			params,
		);
	}
}
