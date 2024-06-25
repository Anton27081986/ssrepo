import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { IClientDataDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ClientProposalsApiService {
	// заготовка для таблиц в аккордионе
	public constructor(private readonly http: HttpClient) {}

	public getModelClientData(clientId: number): Observable<any> {
		return this.http.get<IClientDataDto>(
			`${environment.apiUrl}/api/ClientProposals/doneProductions/${clientId}`,
		);
	}

	public getContractors(): Observable<any> {
		return this.http.get<IClientDataDto>(
			`${environment.apiUrl}/api/ClientProposals/contractors`,
		);
	}

	public getNews(): Observable<any> {
		return this.http.get<IClientDataDto>(`${environment.apiUrl}/api/ClientProposals/news`);
	}

	public getSamples(): Observable<any> {
		return this.http.get<IClientDataDto>(`${environment.apiUrl}/api/ClientProposals/samples`);
	}

	public getProductSheets(): Observable<any> {
		return this.http.get<IClientDataDto>(
			`${environment.apiUrl}/api/ClientProposals/productSheets`,
		);
	}

	public getCommitteeDevelopments(): Observable<any> {
		return this.http.get<IClientDataDto>(
			`${environment.apiUrl}/api/ClientProposals/CommitteeDevelopments`,
		);
	}

	public getTrips(): Observable<any> {
		return this.http.get<IClientDataDto>(`${environment.apiUrl}/api/ClientProposals/trips`);
	}
}
