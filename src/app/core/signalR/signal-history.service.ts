import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';

@Injectable({
	providedIn: 'root',
})
export class SignalHistoryService {
	private hubConnection: HubConnection | undefined;
	private readonly historyChanged: Subject<IChangeTrackerItemDto> =
		new Subject<IChangeTrackerItemDto>();

	public constructor() {
		this.buildConnection();
		this.startConnection();
	}

	private buildConnection() {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl('/changeTracker') // URL вашего SignalR Hub
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

		this.hubConnection.on('OnHistoryChanged', (data: IChangeTrackerItemDto) => {
			this.historyChanged.next(data);
		});
	}

	public subscribeToChanges(objectId: number, type: number): void {
		if (!this.hubConnection) {
			console.error('Хаб не инициализрован');

			return;
		}

		this.hubConnection
			.invoke('Subscibe', objectId, type)
			.catch(err => console.error(`Ошибка подписки: ${err}`));
	}

	public getHistoryChanged(): Observable<IChangeTrackerItemDto> {
		return this.historyChanged.asObservable();
	}
}
