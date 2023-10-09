import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(readonly authenticationService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const currentUser = this.authenticationService.currentUserValue;

        if (currentUser && currentUser?.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
            });
        }

        return next.handle(request).pipe(
            tap((data: unknown) => {
                switch (data.status) {
                    case 401: {
                        this.authenticationService.logout();
                        break;
                    }
                }
            }),
        );
    }
}
