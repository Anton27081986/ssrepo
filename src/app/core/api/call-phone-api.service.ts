import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class CallPhoneApiService {
	constructor(private readonly http: HttpClient) {}

	public callByIpPhone(linkToCall: string): Observable<any> {
		return this.http.get<any>(linkToCall);
	}

	public resetCallByIpPhone(): Observable<any> {
		return this.http.get<any>(`https://ssnab.it/personal/mols/endCall`);
	}
}
