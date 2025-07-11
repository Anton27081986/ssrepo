import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IResponse, ProductionPlanResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/production-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanPatch,
} from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import { AddToVRequest } from '@app/core/models/production-plan/add-tov-request';
import {
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import {
	UpdateRawMaterialsRequest,
	LinkToModule,
} from '@app/core/models/production-plan/update-raw-materials-request';
import { ApproveMaterialRequest } from '@app/core/models/production-plan/approve-materials';
import {
	OrderAnOutfit,
	OrderAnOutfitRequest,
} from '@app/core/models/production-plan/order-an-outfit-request';
import {
	CreatePlanFactRequest,
	UpdatePlanFactRequest
} from '@app/core/models/production-plan/plan-fact-request';
import { ICommentsItemDto, ISendComment} from '@app/core/models/production-plan/comments';

@Injectable({ providedIn: 'root' })
export class OperationPlanApiService {
	private http: HttpClient = inject(HttpClient);

	public getOperationPlan(
		request: OperationPlanRequest & Pagination,
	): Observable<ProductionPlanResponse<OperationPlanItem>> {
		let params = new HttpParams();

		Object.entries(request).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				if (Array.isArray(value)) {
					value.forEach((v) => {
						params = params.append(key, v);
					});
				} else {
					params = params.set(key, value);
				}
			}
		});

		return this.http.get<ProductionPlanResponse<OperationPlanItem>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans`,
			{ params },
		);
	}

	public getTransferProductionPlan(productionPlanDayId: number) {
		return this.http.get<IResponse<TransferProductionPlanFromBackend>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/TransferProductionPlans`,
			{ params: { productionPlanDayId } },
		);
	}

	public downloadExel(): Observable<Blob> {
		return this.http.get<Blob>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/Action/Reports`,
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
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/Tovs`,
			{ params },
		);
	}

	public transferProductionPlan(
		params: TransferProductionPlanPatch[],
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/TransferProductionPlans`,
			params,
		);
	}

	public addGp(params: AddToVRequest): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans`,
			params,
		);
	}

	public sendComment(id: number, body: ISendComment): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/${id}/Comments`,
			body,
		);
	}

	public addComment(id: number): Observable<ICommentsItemDto[]> {
		return this.http.get<ICommentsItemDto[]>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/${id}/Comments`,
		);
	}

	public deleteItemsTov(tovIds: number[]) {
		return this.http.request<void>(
			'delete',
			`${environment.apiUrl}/api/manufacturing/OperationalPlans`,
			{ body: { ids: tovIds } },
		);
	}

	public getCalcVariants() {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/ProductCalcVariants`,
		);
	}

	public updateRawMaterial(
		params: UpdateRawMaterialsRequest,
	): Observable<LinkToModule> {
		return this.http.post<LinkToModule>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/CalcRowMaterials`,
			{ ...params },
		);
	}

	public upload1C(): Observable<LinkToModule> {
		return this.http.post<LinkToModule>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/UploadOneS`,
			{},
		);
	}

	public downloadReport(): Observable<LinkToModule> {
		return this.http.post<LinkToModule>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/UploadReport`,
			{},
		);
	}

	public getCities(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/Cities?ids=58&ids=6`,
		);
	}

	public approveMaterials(
		params: ApproveMaterialRequest,
	): Observable<LinkToModule> {
		return this.http.post<LinkToModule>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/ApproveMaterials`,
			params,
		);
	}

	public orderAnOutfit(
		params: OrderAnOutfitRequest,
	): Observable<OrderAnOutfit> {
		return this.http.post<OrderAnOutfit>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/OrderProduction`,
			params,
		);
	}

	public setPlanFact(
		rowId: number,
		params: CreatePlanFactRequest,
	): Observable<OperationPlanItem> {
		return this.http.post<OperationPlanItem>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/${rowId}/PlanFacts`,
			{ ...params },
		);
	}

	public updatePlanFact(
		rowId: number,
		params: UpdatePlanFactRequest,
	): Observable<OperationPlanItem> {
		return this.http.patch<OperationPlanItem>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/${rowId}/PlanFacts`,
			{ ...params },
		);
	}

	public uploadWMS() {
		return this.http.post<LinkToModule>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlans/UploadWMS`,
			{},
		);
	}
}
