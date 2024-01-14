import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
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

    public getFavoriteMenu(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/menu/favorite`);
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

    // Birthday
    public getBirthday(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/birthdays`);
    }

    // Спасибо партнеру
    public getPartnerThanks(): Observable<any> {
        return this.http.get<any[]>(
            `${environment.apiUrl}/api/awards/partnerThanks?date=04.12.2023`,
            {
                // params: new HttpParams().set('date', '04.12.2023'),
            },
        );
    }

    // Спасибо коллеге
    public getThanksColleague(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/thanks`);
    }

    // Адресная книга
    public getAddressBooks(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/AddressBook`);
    }

    // Валюты
    public getCurrency(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/Currency`);
    }

    // Wins список групп
    public getWinsGroups(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/groups`);
    }

    // Wins список побед по группам
    public getWins(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins`);
    }

    // Поиск пользователей по ФИО
    public getUsersByFIO(title: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/search`, {
            params: new HttpParams().set('q', title),
        });
    }

    // Получение пользователя по id
    public getUserById(id: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/${id}`);
    }

    // Добавить like
    setLike(objectId: number, type?: number): Observable<any> {
        return this.http.post<any[]>(`${environment.apiUrl}/api/awards/likes`, {
            objectId,
            type,
        });
    }

    // Удалить like
    deleteLike(objectId: number, type?: number): Observable<any> {
        return this.http.post<any[]>(`${environment.apiUrl}/api/awards/likes`, {
            objectId,
            type,
        });
    }
}
