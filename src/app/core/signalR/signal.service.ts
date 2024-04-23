import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { environment } from '@environments/environment.development';

export interface IChangeTrackerWithObjectId {
	objectId: number;
	type: number;
	item: IChangeTrackerItemDto;
}

@Injectable({
	providedIn: 'root',
})
export class SignalService {
	private hubConnection: HubConnection | undefined;
	private connectionEstablished = false;
	private readonly historyChanged: Subject<IChangeTrackerWithObjectId> =
		new Subject<IChangeTrackerWithObjectId>();

	public startConnection(token: string): void {
		if (!this.connectionEstablished) {
			this.hubConnection = new HubConnectionBuilder()
				.withUrl(`${environment.apiUrl}/api/change-tracker/hubs`, {
					accessTokenFactory: () => token,
				})
				.withAutomaticReconnect()
				.build();

			this.hubConnection
				.start()
				.then(() => {
					console.info('Соединение выполнено');
					this.connectionEstablished = true;
					this.registerOnServerEvents();
				})
				.catch(err => console.error(`Ошибка соединения: ${err}`));
		} else {
			console.warn('Соединение уже создано');
		}
	}

	private registerOnServerEvents(): void {
		if (!this.hubConnection) {
			console.error('Хаб не инициализирован');

			return;
		}

		this.hubConnection.on(
			'OnHistoryChanged',
			(type: number, objectId: number, item: IChangeTrackerItemDto) => {
				this.historyChanged.next({ type, objectId, item } as IChangeTrackerWithObjectId);
			},
		);
	}

	public subscribeToChanges(objectId: number, type: number): void {
		if (!this.hubConnection) {
			console.error('Хаб не инициализрован');

			return;
		}

		this.hubConnection
			.invoke('Subscribe', objectId, type)
			.catch(err => console.error(`Ошибка подписки: ${err}`));
	}

	public disconnect(): void {
		if (this.hubConnection && this.connectionEstablished) {
			this.hubConnection
				.stop()
				.then(() => {
					console.info('Отлючились от хаба');
					this.connectionEstablished = false;
				})
				.catch(err => console.error(`Ошибка отключения от хаба: ${err}`));
		}
	}

	public getHistoryChanged(): Observable<IChangeTrackerWithObjectId> {
		return this.historyChanged.asObservable();
	}
}
