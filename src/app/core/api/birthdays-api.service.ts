import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IBirthdaysListDto } from '@app/core/models/auth/birthdays-list-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Injectable({
	providedIn: 'root',
})
export class BirthdaysApiService {
	constructor(private readonly http: HttpClient) {}

	/** Birthday */
	public getBirthday(date: string): Observable<IBirthdaysListDto> {
		return this.http.get<IBirthdaysListDto>(
			`${environment.apiUrl}/api/auth/users/birthdays`,
			{
				params: new HttpParams().set('date', date),
			}
		);
	}

	/** Birthdays contractor */
	public getBirthdayContractor(
		clientId?: number,
		contractor?: IDictionaryItemDto,
		dateFrom?: string,
		dateTo?: string,
		pageSize?: number,
		offset?: number
	): Observable<any> {
		const params = contractor
			? new HttpParams()
					.set('clientId', clientId!)
					.set('contractorId', contractor.id!)
					.set('dateFrom', dateFrom!)
					.set('dateTo', dateTo!)
					.set('pageSize', pageSize!)
					.set('offset', offset!)
			: new HttpParams()
					.set('clientId', clientId!)
					.set('dateFrom', dateFrom!)
					.set('dateTo', dateTo!)
					.set('pageSize', pageSize!)
					.set('offset', offset!);

		return this.http.get<any>(
			`${environment.apiUrl}/api/company/BirthDays`,
			{
				params,
			}
		);
	}

	public searchBirthdayContractor(
		clientId?: number,
		contractorId?: number
	): Observable<any> {
		return this.http.get<any>(
			`${environment.apiUrl}/api/company/BirthDays`,
			{
				params: new HttpParams()
					.set('clientId', clientId!)
					.set('contractorId', contractorId!),
			}
		);
	}
}
