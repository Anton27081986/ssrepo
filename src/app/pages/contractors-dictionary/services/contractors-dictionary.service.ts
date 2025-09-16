import { inject, Injectable } from '@angular/core';
import { ContractorsDictionaryApiService } from '@app/pages/contractors-dictionary/api/contractors-dictionary-api.service';
import { Observable } from 'rxjs';
import { ContractorQuickView } from '@app/pages/contractors-dictionary/models';

@Injectable({
	providedIn: 'root',
})
export class ContractorsDictionaryService {
	private readonly apiService = inject(ContractorsDictionaryApiService);

	public quickView(id: number): Observable<ContractorQuickView> {
		return this.apiService.quickView(id);
	}
}
