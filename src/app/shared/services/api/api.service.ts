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

    /** Получить прочие настройки пользователя */
    public getSettings(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/settings`);
    }

    /** Theme */
    public getTheme(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/theme`);
    }

    /** Sale */
    public getAuctions(Offset: number, Limit: number): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/sales/widget`, {
            params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
        });
    }

    /** Birthday */
    public getBirthday(date: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/birthdays`, {
            params: new HttpParams().set('date', date),
        });
    }

    /** Спасибо партнеру */
    public getPartnerThanks(date: any): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/partnerThanks?date=${date}`, {
            // params: new HttpParams().set('date', '04.12.2023'),
        });
    }

    /** Спасибо коллеге */
    public getThanksColleague(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/thanks`);
    }

    /** Адресная книга */
    public getAddressBooks(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/AddressBook`);
    }

    /** Валюты */
    public getCurrency(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/Currency`);
    }

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

    /** Добавить комментарий */
    public addCommets(objectId: string, type: any, awardId: any, note: any): Observable<any> {
        return this.http.post<any[]>(`${environment.apiUrl}/api/awards/comments`, {
            objectId,
            type,
            awardId,
            note,
        });
    }

    /** Получить комментарий по objectId */
    public getComment(
        objectId: number,
        Type: number,
        Offset?: number,
        Limit?: number,
    ): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/comments/${objectId}`, {
            params: new HttpParams().set('Type', Type).set('Offset', Offset!).set('Limit', Limit!),
        });
    }

    /** Поиск продукта по названию */
    public searchProductByName(q: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/products`, {
            params: new HttpParams().set('q', q),
        });
    }

    /** Поиск пользователей по ФИО */
    public getUsersByFIO(title: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/search`, {
            params: new HttpParams().set('q', title),
        });
    }

    /** Общий поиск */
    public search(title: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/search`, {
            params: new HttpParams().set('q', title),
        });
    }

    /** Получение пользователя по id */
    public getUserById(id: string): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/users/${id}`);
    }

    /** Получение продукта по id */
    public getProductById(id: number): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/wins/products/${id}`);
    }

    /** Добавить like */
    setLike(objectId: number, type?: number, awardId?: number): Observable<any> {
        return this.http.post<any[]>(`${environment.apiUrl}/api/awards/likes`, {
            objectId,
            type,
            awardId,
        });
    }

    /** Удалить like */
    deleteLike(objectId: any, type: any): Observable<any> {
        return this.http.delete<any[]>(`${environment.apiUrl}/api/awards/likes`, {
            params: new HttpParams().set('objectId', objectId).set('type', type),
        });
    }

    getListLikedUsers(id: number, type: number): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/likes/${id}`, {
            params: new HttpParams().set('Type', type),
        });
    }

    /** Рейтинги
    /** Список типов рейтингов */
    getRankTypes(weekId: any, userId: any): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/types`, {
            params: new HttpParams().set('weekId', weekId).set('userId', userId),
        });
    }

    /** Список последних 5 недель */
    getRankWeeks(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/weeks`);
    }

    /** Cписок пользователей в выбранном рейтинге */
    getRank(weekId: number, RankTypeId: number, Limit: number, Offset: number): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank`, {
            params: new HttpParams()
                .set('weekId', weekId)
                .set('RankTypeId', RankTypeId)
                .set('Limit', Limit)
                .set('Offset', Offset),
        });
    }

    /** Получение комментария по id */
    public getCommentId(id: number): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/awards/comments/${id}`, {
            params: new HttpParams().set('id', id),
        });
    }

    /** Удаление комментария по id */
    public removeCommentById(id: number): Observable<any> {
        return this.http.post<any[]>(`${environment.apiUrl}/api/awards/comments/${id}`, {
            params: new HttpParams().set('id', id),
        });
    }
}
