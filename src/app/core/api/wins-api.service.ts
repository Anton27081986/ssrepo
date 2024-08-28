import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IWinsListDto } from '@app/core/models/awards/wins-list-dto';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { ICommentRequest } from '@app/core/models/awards/comment-request';
import { ILikeRequest } from '@app/core/models/awards/like-request';
import { IWinsItemDto } from '@app/core/models/awards/wins-item-dto';

@Injectable({
	providedIn: 'root',
})
export class WinsApiService {
	public constructor(private readonly http: HttpClient) {}

	/** Wins список побед без групп */
	public getWins(Limit: number, Offset: number): Observable<IWinsListDto> {
		return this.http.get<IWinsListDto>(`${environment.apiUrl}/api/awards/wins`, {
			params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
		});
	}

	/** Добавить победу */
	public addWins(text: string, userIds: number[], productIds: number[]): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/wins`, {
			text,
			userIds,
			productIds,
		});
	}

	public addCommentWins(request: ICommentRequest): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/comments`, {
			objectId: request.objectId,
			type: request.type,
			awardId: null,
			note: request.note,
			fileIds: [],
		});
	}

	public getProductSearch(q: string): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/awards/wins/products`,
			{
				params: new HttpParams().set('q', q),
			},
		);
	}

	public getCommentsWins(request: ICommentRequest): Observable<IResponse<ICommentsItemDto>> {
		return this.http.get<IResponse<ICommentsItemDto>>(
			`${environment.apiUrl}/api/awards/comments/${request.objectId}`,
			{
				params: new HttpParams()
					.set('Type', request.type)
					.set('Offset', 0)
					.set('Limit', 1000),
			},
		);
	}

	public getWin(id: number): Observable<IWinsItemDto> {
		return this.http.get<IWinsItemDto>(`${environment.apiUrl}/api/awards/wins/${id}`);
	}

	public updateCommentWins(
		id: number,
		request: ICommentRequest,
	): Observable<IResponse<ICommentsItemDto>> {
		return this.http.put<IResponse<ICommentsItemDto>>(
			`${environment.apiUrl}/api/awards/comments/${id}`,
			{
				objectId: request.objectId,
				type: request.type,
				awardId: 1,
				note: request.note,
				fileIds: [],
			},
		);
	}

	/** Получение продукта по id */
	public getProductById(id: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/products/${id}`);
	}

	/** Удаление комментария по id */
	public removeVictoryCommentsById(id: number): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/comments/${id}`, {
			params: new HttpParams().set('id', id),
		});
	}

	public addLikeVictory(request: ILikeRequest): Observable<any> {
		return this.http.post<any[]>(`${environment.apiUrl}/api/awards/likes`, {
			objectId: request.objectId,
			type: request.type,
			awardId: request.awardId,
		});
	}

	public removeLikeVictory(request: ILikeRequest): Observable<any> {
		return this.http.delete<any[]>(`${environment.apiUrl}/api/awards/likes`, {
			params: new HttpParams().set('ObjectId', request.objectId).set('type', request.type),
		});
	}
}
