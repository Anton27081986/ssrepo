import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, take, takeLast, tap} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {IUser} from '@app/pages/auth/models/user';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private readonly userSubject: BehaviorSubject<IUser>;
    user: Observable<IUser | null>;

    public headers = new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')


    constructor(
        private readonly router: Router,
        private readonly http: HttpClient,
    ) {
        this.userSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    get userValue(): IUser {
        return this.userSubject.value;
    }

    login(username: string, password: string): Observable<IUser> {
        return this.http
            .post<IUser>(`${environment.apiUrl}/users/authenticate`, {username, password})
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);

                    return user;
                }),
            );
    }

    // Basic Auth
    loginBasic(Username: string, Password: string, ReturnUrl: string): Observable<any> {
        return this.http
            .post<any>(
                `https://ssnab.it/login?ReturnUrl=https://erp-dev.ssnab.it/`,
                {Username, Password, ReturnUrl},
                {
                    'headers': this.headers,
                    'withCredentials': true,
                    'observe': 'response',
                    'params': {Username,Password,ReturnUrl},
                    'responseType': 'text' as 'json',
                    'reportProgress': true
                },
            )
            .pipe(
                take(1),
                takeLast(1),
                tap(user => {
                    console.log('user', user);
                }),
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null as unknown as IUser);
        this.router.navigate(['/login']);
    }
}
