import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMainMenu } from '@app/components/main-menu/main-menu.interface';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class MenuApiService {
	public constructor(private readonly http: HttpClient) {}

	public getMenu(): Observable<any> {
		return this.http.get<IMainMenu[]>(`${environment.apiUrl}/api/company/menu`, {
			withCredentials: false,
		});
	}

	public getFavoriteMenu(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/company/menu/favorite`);
	}
}
