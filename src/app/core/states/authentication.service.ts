import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser } from '@auth/models/user';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private readonly userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(
		JSON.parse(localStorage.getItem('user')!),
	);

	public user: Observable<IUser | null> = this.userSubject.asObservable();

	private readonly headers = new HttpHeaders()
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json');

	private readonly params = new HttpParams({ fromString: `ReturnUrl=${environment.apiUrl}` }).set(
		'ReturnUrl',
		environment.apiUrl,
	);

	public constructor(
		private readonly router: Router,
		private readonly http: HttpClient,
	) {}

	public get userValue(): IUser {
		return this.userSubject.value;
	}

	public login(username: string, password: string) {
		return this.http
			.post<any>(
				`${environment.apiUrl}/api/auth/login`,
				{ username, password },
				{
					headers: this.headers,
					observe: 'body',
					params: this.params,
					responseType: 'json',
					reportProgress: true,
				},
			)
			.pipe(
				map(user => {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('user', JSON.stringify(user));
					this.userSubject.next(user);

					return user;
				}),
			);
	}

	public enterUnderFriendlyAccount(userId: number, returnUrl: string) {
		return this.http
			.post<any>(
				`${environment.apiUrl}/api/auth/changeUser`,
				{ userId, returnUrl },
				{
					headers: this.headers,
					observe: 'body',
					params: this.params,
					responseType: 'json',
					reportProgress: true,
				},
			)
			.pipe(
				map(user => {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('user', JSON.stringify(user));
					this.userSubject.next(user);

					return user;
				}),
			);
	}

	public logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('user');
		this.userSubject.next(null as unknown as IUser);
		this.router.navigate(['/auth/sign-in']);
		// TODO: need clear cookies
	}

	public authImages() {
		return this.http
			.post<any>(
				`https://ssnab.it/login/TmpCheck`,
				{},
				{
					headers: this.headers,
					observe: 'body',
					responseType: 'json',
					reportProgress: true,
				},
			)
			.pipe(
				map(user => {
					console.log('user image', user);
				}),
			);
	}
}
