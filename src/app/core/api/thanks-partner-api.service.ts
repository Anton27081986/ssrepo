import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPartnerThanksListDto } from '@app/core/models/awards/partner-thanks-list-dto';

@Injectable({
	providedIn: 'root',
})
export class ThanksPartnerApiService {
	constructor(private readonly http: HttpClient) {}

	/** Спасибо партнеру */
	public getPartnerThanks(date: string): Observable<IPartnerThanksListDto> {
		return this.http.get<IPartnerThanksListDto>(
			`${environment.apiUrl}/api/awards/partnerThanks?date=${date}`,
			{},
		);
	}
}
