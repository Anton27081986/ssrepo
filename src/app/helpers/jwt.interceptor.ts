import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercepting Request withCredentials=true ');
        request = request.clone({
            withCredentials: true,
        });

        return next.handle(request);
    }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     // add auth header with jwt if user is logged in and request is to api url
    //
    //     console.log('Intercepting Request withCredentials=true ');
    //
    //     const user = this.authenticationService.userValue;
    //     const isLoggedIn = user?.token;
    //     const isApiUrl = request.url.startsWith(environment.apiUrl);
    //
    //     if (isLoggedIn && isApiUrl) {
    //         request = request.clone({
    //             setHeaders: {
    //                 // Authorization: `Bearer ${user.token}`,
    //             },
    //             withCredentials: true,
    //         });
    //     }
    //
    //     return next.handle(request).pipe(
    //         tap(
    //             event => {
    //                 if (event instanceof HttpResponse) {
    //                     console.log('Server response');
    //                 }
    //             },
    //             (err: unknown) => {
    //                 if (err instanceof HttpErrorResponse) {
    //                     if (err.status === 401) {
    //                         console.log('Unauthorized');
    //                     }
    //                 }
    //             },
    //         ),
    //     );
    // }
}
