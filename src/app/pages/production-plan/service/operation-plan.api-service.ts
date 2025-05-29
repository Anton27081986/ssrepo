import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/operation-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanPatch,
} from '@app/core/models/operation-plan/transfer-production-plan-from-backend';
import { AddToVRequest } from '@app/core/models/operation-plan/add-tov-request';

@Injectable({ providedIn: 'root' })
export class OperationPlanApiService {
	private http: HttpClient = inject(HttpClient);

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
