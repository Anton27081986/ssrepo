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
        return this.http.get<IMainMenu[]>(`${environment.apiUrl}/api/company/menu`, {
            withCredentials: false,
        });
    }

    public getSocialLink(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/settings/favoriteLinks`);
    }

    public getBanners(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/banners`);
    }

    public getAccounts(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/friends`);
    }

    // Получить прочие настройки пользователя
    public getSettings(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/settings`);
    }

    // Theme
    public getTheme(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/theme`);
    }

    // Sale
    public getAuctions(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/sales/widget`);
    }
}
