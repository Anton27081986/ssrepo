import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ContractorQuickView } from '@app/pages/contractors-dictionary/models';

@Injectable({
	providedIn: 'root',
})
export class ContractorsDictionaryApiService {
	private readonly http = inject(HttpClient);
	private readonly prefix = 'counterparty';

	public quickView(id: number): Observable<ContractorQuickView> {
		return this.http.get<ContractorQuickView>(
			`${environment.apiUrl}/api/${this.prefix}/${id}/quick-view/`
		);
	}
}
