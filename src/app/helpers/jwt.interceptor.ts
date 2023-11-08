import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpClient,
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

import {environment} from '@environments/environment';
import {AuthenticationService} from '@auth/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private readonly http: HttpClient,
        private readonly authenticationService: AuthenticationService,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authenticationService
            .loginBasic('nekrasov_va', 'RH$x9U&Lx@KYRB2')
            .pipe(tap(val => console.log('val', val)))
            .subscribe(
                (data: any) => {
                    if (data) {
                        console.log('data', data);
                    }
                },
                (err: unknown) => console.log('HTTP Error', err),
                () => console.log('HTTP request completed.'),
            );

        // add auth header with jwt if user is logged in and request is to api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
        }

        return next.handle(request).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        // console.log('Server response');
                    }
                },
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            // console.log('Unauthorized');
                        }
                    }
                },
            ),
        );
    }
}
