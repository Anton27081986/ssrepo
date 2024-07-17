import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class VictoryService {
	public count$ = new Subject<number>();

	public constructor(private readonly http: HttpClient) {}

	/** Удаление комментария по id */
	public removeVictoryById(id: number): Observable<any> {
		return this.http.delete<any[]>(`${environment.apiUrl}/api/awards/wins/${id}`, {
			params: new HttpParams().set('id', id),
		});
	}

	public updateWinList(count: number) {
		this.count$.next(count);
	}
}
