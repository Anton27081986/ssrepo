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
export class SignalHistoryService {
	private hubConnection: HubConnection | undefined;
	private readonly historyChanged: Subject<IChangeTrackerWithObjectId> =
		new Subject<IChangeTrackerWithObjectId>();

	public constructor() {
		this.buildConnection();
		this.startConnection();
	}

	private buildConnection() {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(`${environment.apiUrl}/api/change-tracker/hubs`)
			.withAutomaticReconnect()
			.build();
	}

	private startConnection(): void {
		if (!this.hubConnection) {
			console.error('Хаб не инициализирован');

			return;
		}

		this.hubConnection
			.start()
			.then(() => {
				console.info('Соединение выполнено');
				this.registerOnServerEvents();
			})
			.catch(err => console.error(`Ошибка соединения: ${err}`));
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

	public getHistoryChanged(): Observable<IChangeTrackerWithObjectId> {
		return this.historyChanged.asObservable();
	}
}
