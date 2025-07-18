import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { environment } from '@environments/environment';

export interface IChangeTrackerWithObjectId {
	objectId: string;
	type: number;
	item: IChangeTrackerItemDto;
}

@Injectable({
	providedIn: 'root',
})
export class SignalService {
	private hubConnection: HubConnection | undefined;
	private readonly historyChanged: Subject<IChangeTrackerWithObjectId> =
		new Subject<IChangeTrackerWithObjectId>();

	public historyChange$ = this.historyChanged.asObservable();

	public startConnection(token: string, objectId: string, type: number) {
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
				this.registerOnServerEvents();
				console.info('Подписались на onHistoryChange');
			})
			.then(() => {
				this.subscribeToChanges(objectId, type);
				console.info('Вызвали Subscribe');
			})
			.catch((err) => console.error(`Ошибка соединения: ${err}`));
	}

	private registerOnServerEvents(): void {
		this.hubConnection?.on(
			'OnHistoryChanged',
			(objectId: string, type: number, item: IChangeTrackerItemDto) => {
				const change: IChangeTrackerWithObjectId = {
					item,
					objectId,
					type,
				};

				this.historyChanged.next(change);
			}
		);
	}

	private subscribeToChanges(objectId: string, type: number): void {
		this.hubConnection
			?.invoke('Subscribe', objectId, type)
			.catch((err) => console.error(`Ошибка подписки: ${err}`));
	}

	public disconnect(): void {
		if (this.hubConnection) {
			this.hubConnection
				.stop()
				.then(() => {
					console.info('Отлючились от хаба');
				})
				.catch((err) =>
					console.error(`Ошибка отключения от хаба: ${err}`)
				);
			this.hubConnection = undefined;
		}
	}
}
