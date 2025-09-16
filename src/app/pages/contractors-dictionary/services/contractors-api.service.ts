import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ContractorsApiService {
	private http: HttpClient = inject(HttpClient);
	public getContractors(): Observable<IResponse<ContractorsItemDto>> {
		return this.http.get<IResponse<ContractorsItemDto>>(
			`${environment.apiUrl}/api/Counterparty/registry`
		);
	}
}
