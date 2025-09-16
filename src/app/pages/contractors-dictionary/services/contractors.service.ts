import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { ContractorsApiService } from '@app/pages/contractors-dictionary/services/contractors-api.service';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';

@Injectable({
	providedIn: 'root',
})
export class ContractorsService {
	private apiService: ContractorsApiService = inject(ContractorsApiService);

	public getContractors(): Observable<IResponse<ContractorsItemDto>> {
		return this.apiService.getContractors();
	}
}
