import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { IClientDto } from '@app/core/models/company/client-dto';

@Injectable({
	providedIn: 'root',
})
export class ClientApiService {
	public constructor(private readonly http: HttpClient) {}

	public getClients() {}

	public getClientCardById(id: number): Observable<IClientDto> {
		return this.http.get<IClientDto>(`${environment.apiUrl}/api/company/client/${id}`, {
			params: new HttpParams().set('id', id),
		});
	}

	public updateClientCard() {}

	public addManager() {}

	public deleteManager() {}

	public setMainManager() {}

	public getContractors() {}

	public getSubSectors() {}

	public getRegions(){}
}
