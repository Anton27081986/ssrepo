import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUser} from '@app/pages/auth/models/user';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private readonly userSubject: BehaviorSubject<IUser>;
    user: Observable<IUser | null>;

    // public baseUrl = `https://ssnab.it/login`;
    public baseUrl = `https://erp-dev.ssnab.it/api/auth/Auth/login`;

    public headers = new HttpHeaders()
        .set('Accept', 'application/json')
        // .set('Access-Control-Allow-Origin', 'https://erp-dev.ssnab.it')
        // .set('Content-Type', 'application/x-www-form-urlencoded');
        .set('Content-Type', 'application/json');

    // public params = new HttpParams({fromString: 'ReturnUrl=https://erp-dev.ssnab.it/'}).set(
    //     'ReturnUrl',
    //     'https://erp-dev.ssnab.it/',
    // );

    public params = new HttpParams();

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

    loginBasic(userName: string, password: string) {
        const body = new URLSearchParams();

        body.set('username', userName);
        body.set('password', password);
        // body.set('grant_type', 'password');

        return this.http.post(this.baseUrl, body.toString(), {
            headers: this.headers,
            // withCredentials: true,
            observe: 'body',
            params: this.params,
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
