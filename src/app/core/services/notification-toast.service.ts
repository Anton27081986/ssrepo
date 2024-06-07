import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type ToastType = 'ok' | 'warning' | 'error';

export interface IToast {
	id: number;
	message: string;
	type: ToastType;
}

@Injectable({
	providedIn: 'root',
})
export class NotificationToastService {
	private readonly NotificationsStorage = new BehaviorSubject<IToast[]>([]);
	public notificationsStorage$: Observable<IToast[]> = this.NotificationsStorage.asObservable();

	public addToast(message: string, type: ToastType): void {
		const id = parseInt(Math.random().toString(10).slice(2), 10);

		this.NotificationsStorage.next([...this.NotificationsStorage.value, { id, message, type }]);

		setTimeout(() => {
			this.deleteToast(id);
		}, 10000);
	}

	public deleteToast(id: number) {
		this.NotificationsStorage.next(
			this.NotificationsStorage.value.filter(toast => toast.id !== id),
		);
	}
}
