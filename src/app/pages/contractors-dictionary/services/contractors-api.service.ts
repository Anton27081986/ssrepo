import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';
import { ContractorsDictionaryRequestParams } from '@app/pages/contractors-dictionary/models/contractors-dictionary-request-param';

@Injectable({
	providedIn: 'root',
})
export class ContractorsApiService {
	private http: HttpClient = inject(HttpClient);

	public getContractors(
		param: ContractorsDictionaryRequestParams
	): Observable<IResponse<ContractorsItemDto>> {
		let params = new HttpParams();

		Object.entries(param).forEach(([key, value]) => {
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

		return this.http.get<IResponse<ContractorsItemDto>>(
			`${environment.apiUrl}/api/Counterparty/registry`,
			{ params }
		);
	}
}
