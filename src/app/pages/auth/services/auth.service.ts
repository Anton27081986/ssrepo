import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {IUser} from '../data/schema/user';

import {environment} from '../../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly currentUserSubject: BehaviorSubject<IUser>;
    readonly currentUser: Observable<IUser>;

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {
        this.currentUserSubject = new BehaviorSubject<IUser>(
            // @ts-ignore @typescript-eslint/ban-ts-comment
            JSON.parse(localStorage.getItem('currentUser')),
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    private get currentUserValue(): IUser {
        return this.currentUserSubject.value;
    }

    private get isLogin(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    login(user: unknown): Observable<IUser> {
        return this.http.post<IUser>(`${apiUrl}auth/login`, user, {}).pipe(
            tap(data => {
                if (data && data.accessToken && data.refreshToken) {
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    this.currentUserSubject.next(data);
                }

                return data;
            }),
        );
    }

    register(user: unknown): Observable<unknown> {
        return this.http.post<IUser>(``, user);
    }

    logout(): void {
        localStorage.removeItem('currentUser');

        // this.currentUserSubject.next();
        this.router.navigate(['/auth/', 'login']);
    }
}
