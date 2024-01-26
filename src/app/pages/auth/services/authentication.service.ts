import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {IUser} from '@app/pages/auth/models/user';
import {environment} from '@environments/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private readonly userSubject: BehaviorSubject<IUser>;
    user: Observable<IUser | null>;

    headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

    params = new HttpParams({fromString: `ReturnUrl=${environment.apiUrl}`}).set(
        'ReturnUrl',
        environment.apiUrl,
    );

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

    login(username: string, password: string) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/api/auth/login`,
                {username, password},
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

    enterUnderFriendlyAccount(userId: number, returnUrl: string) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/api/auth/changeUser`,
                {userId, returnUrl},
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

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null as unknown as IUser);
        this.router.navigate(['/auth/sign-in']);
    }
}
