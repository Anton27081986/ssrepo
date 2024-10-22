import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { Notifications } from '@app/core/constants/notifications.constants';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly notificationToastService: NotificationToastService,
		private readonly route: Router,
	) {}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err: unknown) => {
				if (err instanceof HttpErrorResponse) {
					if (Math.floor(err.status / 100) === 4) {
						if (err.status === 401) {
							if (err.error?.status && err.error?.status === 405) {
								this.route
									.navigate([`auth/forgot-password`], {
										queryParams: { login: request.body.username },
									})
									.then();
							} else {
								this.authenticationService.logout();
							}

							this.notificationToastService.addToast(
								err.error?.title || Notifications.SERVER_ERROR_UNAUTHORIZED,
								'warning',
								err.status,
							);
						} else if (err.error.errors) {
							for (const field in err.error.errors) {
								this.notificationToastService.addToast(
									err.error.errors[field][0],
									'warning',
									err.status,
								);
							}
						} else {
							this.notificationToastService.addToast(
								err.error.title,
								'warning',
								err.status,
							);
						}
					}

					if (Math.floor(err.status / 100) === 5) {
						this.notificationToastService.addToast(
							Notifications.SERVER_ERROR_NOTIFICATION_TEXT,
							'error',
						);
					}
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const error = err.error?.message || err.statusText;

				return throwError(() => error);
			}),
		);
	}
}
