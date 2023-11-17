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
        // add auth header with jwt if user is logged in and request is to api url

        console.log("Intercepting Request withCredentials=true ");

        const user = this.authenticationService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    // Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true
            });
        }

        return next.handle(request).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        console.log('Server response');
                    }
                },
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            console.log('Unauthorized');
                        }
                    }
                },
            ),
        );
    }
}
