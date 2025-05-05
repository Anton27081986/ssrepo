import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/operation-plan/manufacturing-tovs';

@Injectable({ providedIn: 'root' })
export class OperationPlanApiService {
	private http: HttpClient = inject(HttpClient);

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

	public getManufacturingTov(): Observable<IResponse<ManufacturingTovs>> {
		return this.http.get<IResponse<ManufacturingTovs>>(
			`${environment.apiUrl}/api/manufacturing/OperationalPlan/Tovs`,
		);
	}
}
