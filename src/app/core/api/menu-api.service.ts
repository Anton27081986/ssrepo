import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IMenuListDto } from '@app/core/models/company/menu-list-dto';
import { IFavoriteMenuListDto } from '@app/core/models/company/favorite-menu-list-dto';
import { IGlobalSearchDto } from '@app/core/models/company/global-search-dto';
import { IResponse } from '@app/core/utils/response';

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

	public addItemToFavoriteMenu(id: number): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/company/menu/${id}/favorite`, {
			params: new HttpParams().set('id', id),
		});
	}

	public deleteItemToFavoriteMenu(id: number): Observable<any> {
		return this.http.delete<any[]>(`${environment.apiUrl}/api/company/menu/${id}/favorite`, {
			params: new HttpParams().set('id', id),
		});
	}

	public globalSearch(query: string): Observable<IResponse<IGlobalSearchDto>> {
		return this.http.get<IResponse<IGlobalSearchDto>>(`${environment.apiUrl}/api/search`, {
			params: new HttpParams().set('q', query),
		});
	}
}
