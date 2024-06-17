import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { Notifications } from '@app/core/constants/notifications.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly notificationToastService: NotificationToastService,
	) {}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err: unknown) => {
				if (err instanceof HttpErrorResponse) {
					if (Math.floor(err.status / 100) === 4) {
						this.notificationToastService.addToast(err.error.title, 'warning');
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
