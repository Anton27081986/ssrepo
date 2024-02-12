import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/states/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	public constructor(private readonly authenticationService: AuthenticationService) {}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err: unknown) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if ([401, 403].includes(err.status) && this.authenticationService.userValue) {
					// auto logout if 401 Unauthorized or 403 Forbidden response returned from services
					this.authenticationService.logout();
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const error = err.error.message || err.statusText;

				return throwError(() => error);
			}),
		);
	}
}
