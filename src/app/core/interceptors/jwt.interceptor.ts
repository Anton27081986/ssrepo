import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { environment } from '@environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(
		private readonly authenticationService: AuthenticationService,
	) {}

	public intercept(
		request: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		// add auth header with jwt if user is logged in and request is to services url
		const user = this.authenticationService.userValue;
		const isLoggedIn = user?.token;
		const isApiUrl = request.url.startsWith(environment.apiUrl);

		if (isLoggedIn && isApiUrl) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: false,
			});
		}

		return next.handle(request);
	}
}
