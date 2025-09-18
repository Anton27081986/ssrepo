import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ContractorsApiService } from '@app/pages/contractors-dictionary/services/contractors-api.service';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';
import { ContractorsDictionaryRequestParams } from '@app/pages/contractors-dictionary/models/contractors-dictionary-request-param';

@Injectable({
	providedIn: 'root',
})
export class ContractorsService {
	private apiService: ContractorsApiService = inject(ContractorsApiService);

	public getContractors(
		param: ContractorsDictionaryRequestParams
	): Observable<IResponse<ContractorsItemDto>> {
		return this.apiService.getContractors(param);
	}
}
