import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IMainMenu } from '@app/components/main-menu/main-menu.interface';
import { environment } from '@environments/environment.development';
import { IResponse } from '@app/core/utils/response';
import { IAddressBookUser } from '@app/core/models/address-book-user';
import { IThanksColleagueItem } from '@app/components/thank-colleague/models/thanks-colleague-item';
import { ICreateThanksColleagueRequest } from '@app/components/thank-colleague/models/create-thanks-colleague-request';
import { IUserProfile } from '@app/core/models/user-profile';
import {ITransport} from "@app/core/models/transport";
import {IExchangeRates} from "@app/core/models/exchange-rates";

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	public constructor(private readonly http: HttpClient) {}

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

	/** Sale */
	public getAuctions(Limit: number, Offset: number): Observable<any> {
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
	public getThanksColleagueList(
		Limit: number,
		Offset: number,
	): Observable<IResponse<IThanksColleagueItem>> {
		return this.http.get<IResponse<IThanksColleagueItem>>(
			`${environment.apiUrl}/api/awards/thanks`,
			{
				params: new HttpParams().set('Offset', Offset).set('Limit', Limit),
			},
		);
	}

	public addThanksColleague(createThanksRequest: ICreateThanksColleagueRequest): Observable<any> {
		return this.http.post<any[]>(
			`${environment.apiUrl}/api/awards/thanks`,
			createThanksRequest,
		);
	}

	// Удалить спасибо коллеге по id
	public deleteThanksColleague(id: number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}/api/awards/thanks/${id}`);
	}

	/** Адресная книга */
	public getAddressBookUsers(): Observable<IResponse<IAddressBookUser>> {
		return this.http.get<IResponse<IAddressBookUser>>(
			`${environment.apiUrl}/api/auth/AddressBook`,
			{
				params: new HttpParams(),
			},
		);
	}

	public addToAddressBook(userId: number): Observable<any> {
		return this.http.post(`${environment.apiUrl}/api/auth/AddressBook/${userId}`, { userId });
	}

	public deleteFromAddressBook(userId: number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}/api/auth/AddressBook/${userId}`);
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
	public addCommets(
		objectId: number,
		type: number,
		awardId: number,
		note: string,
	): Observable<any> {
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
		Offset: number,
		Limit: number,
	): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/comments/${objectId}`, {
			params: new HttpParams().set('Type', Type).set('Offset', Offset).set('Limit', Limit),
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
		return this.http.get<any>(`${environment.apiUrl}/api/auth/users/search`, {
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

	public getListLikedUsers(id: number, type: number): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/likes/${id}`, {
			params: new HttpParams().set('Type', type),
		});
	}

	/** Рейтинги
     /** Список типов рейтингов */
	public getRatingTypes(weekId: any, userId: any): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/types`, {
			params: new HttpParams().set('weekId', weekId).set('userId', userId),
		});
	}

	/** Список последних 5 недель */
	public getLastFiveRatingWeeks(): Observable<any> {
		return this.http.get<any[]>(`${environment.apiUrl}/api/awards/rank/weeks`);
	}

	/** Cписок пользователей в выбранном рейтинге */
	public getRatings(
		weekId: number,
		RankTypeId: number,
		Limit: number,
		Offset: number,
	): Observable<any> {
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

	/** Получить профиль текущего пользователя */
	public getProfile(): Observable<IUserProfile> {
		return this.http.get<IUserProfile>(`${environment.apiUrl}/api/auth/Profile`);
	}

	public callByIpPhone(linkToCall: string): Observable<any> {
		return this.http.get<any>(linkToCall);
	}

	public resetCallByIpPhone(): Observable<any> {
		return this.http.get<any>(`https://ssnab.it/personal/mols/endCall`);
	}

	/** Получить расписание транспорта */
	public getTransport(): Observable<ITransport> {
		return this.http.get<ITransport>(`${environment.apiUrl}/api/company/transport`);
	}

	/** Добавить уведомление в расписание транспорта */
	public sendTransportNote(
		dFrom: string | undefined,
		dTo: string | undefined,
		note: string | undefined,
	): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/api/company/transport`, {
			dFrom,
			dTo,
			note,
		});
	}

	/** Получить котировки транспорта */
	public getExchangeRates(): Observable<IExchangeRates> {
		return this.http.get<IExchangeRates>(`${environment.apiUrl}/api/company/Currency`);
	}
}
