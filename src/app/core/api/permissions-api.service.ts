import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class PermissionsApiService {
	constructor(private readonly http: HttpClient) {}

	/** Получить доступ к входу на страницу */
	public getPermissionClient(
		entity: string,
	): Observable<{ items: string[] }> {
		return this.http.get<{ items: string[] }>(
			`${environment.apiUrl}/api/auth/permission/permissions`,
			{
				params: new HttpParams().set('Entities', entity),
			},
		);
	}
}
