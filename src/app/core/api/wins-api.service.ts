import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class WinsApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Wins список групп */
	public getWinsGroups(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/groups`);
	}

	/** Wins список побед без групп */
	public getWins(Limit: number, Offset: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins`, {
			params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
		});
	}

	/** Добавить победу */
	public addWins(text: string, userIds: any, productIds: any): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/wins`, {
			text,
			userIds,
			productIds,
		});
	}

	public searchProductByName(q: string): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/products`, {
			params: new HttpParams().set('q', q),
		});
	}

	/** Получение продукта по id */
	public getProductById(id: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/products/${id}`);
	}
}
