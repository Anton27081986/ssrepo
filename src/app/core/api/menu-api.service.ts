import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IMenuListDto } from '@app/core/models/company/menu-list-dto';
import { IFavoriteMenuListDto } from '@app/core/models/company/favorite-menu-list-dto';

@Injectable({
	providedIn: 'root',
})
export class MenuApiService {
	public constructor(private readonly http: HttpClient) {}

	public getMenu(): Observable<IMenuListDto> {
		return this.http.get<IMenuListDto>(`${environment.apiUrl}/api/company/menu`, {
			withCredentials: false,
		});
	}

	public getFavoriteMenu(): Observable<IFavoriteMenuListDto> {
		return this.http.get<IFavoriteMenuListDto>(
			`${environment.apiUrl}/api/company/menu/favorite`,
		);
	}
}
