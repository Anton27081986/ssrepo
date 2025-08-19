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
import { Notifications } from '@app/core/constants/notifications.constants';
import { Router } from '@angular/router';
import { SharedPopupService, ToastTypeEnum } from '@front-library/components';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly sharedPopupService: SharedPopupService,
		private readonly route: Router
	) {}

	public intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err: unknown) => {
				if (err instanceof HttpErrorResponse) {
					if (Math.floor(err.status / 100) === 4) {
						if (err.status === 401) {
							if (
								err.error?.status &&
								err.error?.status === 405
							) {
								this.route
									.navigate([`auth/forgot-password`], {
										queryParams: {
											login: request.body.username,
										},
									})
									.then();
							} else {
								this.authenticationService.logout();
							}

							this.sharedPopupService.openToast({
								text:
									err.error?.title ||
									Notifications.SERVER_ERROR_UNAUTHORIZED,
								type: ToastTypeEnum.Default,
							});
						} else if (err.error.errors) {
							for (const field in err.error.errors) {
								this.sharedPopupService.openToast({
									text: err.error.errors[field][0],
									type: ToastTypeEnum.Default,
								});
							}
						} else {
							this.sharedPopupService.openToast({
								text: err.error.title,
								type: ToastTypeEnum.Default,
							});
						}
					}

					if (Math.floor(err.status / 100) === 5) {
						this.sharedPopupService.openToast({
							text: Notifications.SERVER_ERROR_NOTIFICATION_TEXT,
							type: ToastTypeEnum.Error,
						});
					}
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const error = err.error?.message || err.statusText;

				return throwError(() => error);
			})
		);
	}
}
