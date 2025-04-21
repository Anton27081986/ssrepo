import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class CommentsApiService {
	constructor(private readonly http: HttpClient) {}

	/** Получить комментарий по objectId */
	public getComment(
		objectId: number,
		Type: number,
		Offset: number,
		Limit: number,
	): Observable<any> {
		return this.http.get<any[]>(
			`${environment.apiUrl}/api/awards/comments/${objectId}`,
			{
				params: new HttpParams()
					.set('Type', Type)
					.set('Offset', Offset)
					.set('Limit', Limit),
			},
		);
	}

	/** Получение комментария по id */
	public getCommentId(id: number): Observable<any> {
		return this.http.get<any[]>(
			`${environment.apiUrl}/api/awards/comments/${id}`,
			{
				params: new HttpParams().set('id', id),
			},
		);
	}

	/** Добавить комментарий */
	public addCommets(
		objectId: number,
		type: number,
		awardId: number,
		note: string,
	): Observable<any> {
		return this.http.post<any[]>(
			`${environment.apiUrl}/api/awards/comments`,
			{
				objectId,
				type,
				awardId,
				note,
			},
		);
	}

	/** Удаление комментария по id */
	public removeCommentById(id: number): Observable<any> {
		return this.http.post<any[]>(
			`${environment.apiUrl}/api/awards/comments/${id}`,
			{
				params: new HttpParams().set('id', id),
			},
		);
	}
}
