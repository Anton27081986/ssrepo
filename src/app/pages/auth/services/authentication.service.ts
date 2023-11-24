import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUser} from '@app/pages/auth/models/user';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private readonly userSubject: BehaviorSubject<IUser>;
    user: Observable<IUser | null>;

    public baseUrl = `https://ssnab.it/login?ReturnUrl=https://erp-dev.ssnab.it/`;

    public headers = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');

    public params = new HttpParams({fromString: 'ReturnUrl=https://erp-dev.ssnab.it/'}).set(
        'ReturnUrl',
        'https://erp-dev.ssnab.it/',
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

    // Basic Auth
    // loginBasicOld(Username: string, Password: string): Observable<any> {
    //     return this.http
    //         .post<any>(
    //             `https://ssnab.it/login`,
    //             {Username, Password},
    //             {
    //                 headers: this.headers,
    //                 withCredentials: true,
    //                 observe: 'body',
    //                 params: this.params,
    //                 responseType: 'json',
    //                 reportProgress: true,
    //             },
    //         )
    //         .pipe(take(1));
    // }

    loginBasic(userName: string, password: string) {
        const headers = new Headers();

        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('No-Auth', 'True');

        const body = new URLSearchParams();

        body.set('Username', userName);
        body.set('Password', password);
        body.set('grant_type', 'password');

        return this.http.post(this.baseUrl, body.toString(), {
            headers: this.headers,
            withCredentials: true,
            observe: 'body',
            // params: this.params,
            responseType: 'json',
            reportProgress: true,
        });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null as unknown as IUser);
        this.router.navigate(['/login']);
    }
}
