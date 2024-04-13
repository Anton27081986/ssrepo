import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ChangeTrackerService {
	public constructor(private readonly http: HttpClient) {}

	public getHistoryOfObject(objectId: number, type: number, limit: number, offset: number) {
		const params = new HttpParams();


	}
}
