import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class LikesApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Добавить like */
	public setLike(objectId: number, type?: number, awardId?: number): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/likes`, {
			objectId,
			type,
			awardId,
		});
	}

	/** Удалить like */
	public deleteLike(objectId: number, type: number): Observable<any> {
		return this.http.delete<any[]>(`${environment.apiUrl}/api/awards/likes`, {
			params: new HttpParams().set('objectId', objectId).set('type', type),
		});
	}
}
