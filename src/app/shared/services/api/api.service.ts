import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IMainMenu} from '@app/components/main-menu/main-menu.interface';
import {environment} from '@environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private readonly http: HttpClient) {}

    public getMenuListJson(): Observable<any> {
        return this.http.get<IMainMenu[]>(`${environment.apiUrl}/menu`, {
            withCredentials: false,
        });
    }

    public getSocialLink(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/settings/favoriteLinks`);
    }

    public getBanners(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/banners`);
    }

    public getAccounts(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/accounts`);
    }

    public getWidgets(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/widgets`);
    }

    // Получить прочие настройки пользователя
    public getSettings(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/settings`);
    }

    // Theme
    public getTheme(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/theme`);
    }
}
