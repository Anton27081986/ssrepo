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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly notificationToastService: NotificationToastService,
	) {}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					switch (true) {
						case request.method === 'POST' && event.status === 200:
							this.notificationToastService.addToast(event.statusText, 'ok');
							break;
						case request.method === 'PUT' && event.status === 200:
							this.notificationToastService.addToast(event.statusText, 'ok');
							break;
					}
				}
			}),
			catchError((err: unknown) => {
				if (err instanceof HttpErrorResponse) {
					if (Math.floor(err.status / 100) === 4) {
						this.notificationToastService.addToast(err.error.message, 'warning');
					}

					if (Math.floor(err.status / 100) === 5) {
						this.notificationToastService.addToast(
							'Ошибка в работе сервера, повторите попытку позже или обратитесь в службу поддержки',
							'error',
						);
					}
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const error = err.error.message || err.statusText;

				return throwError(() => error);
			}),
		);
	}
}
