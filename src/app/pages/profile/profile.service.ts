import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	public isDarkTheme$ = new Subject<number>();

	constructor(private readonly http: HttpClient) {}

	/** Получение темы */
	getTheme(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/company/theme`);
	}

	/** Установка темы */
	updateTheme(value: boolean): Observable<any> {
		return this.http.put<any[]>(`${environment.apiUrl}/api/company/settings`, {
			isDarkTheme: value,
		});
	}

	public changeTheme(value: number) {
		this.isDarkTheme$.next(value);
	}
}
