import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // искл withCredentials для авторизацию в старом кисп
        if (request.url.indexOf('login') !== -1) {
            console.log('middle', request.url.indexOf('login') !== -1);

            request = request.clone({
                withCredentials: true,
            });

            console.log('Intercepting Request withCredentials = true ');
        }

        return next.handle(request);
    }
}
